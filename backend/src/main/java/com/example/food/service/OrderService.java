package com.example.food.service;

import com.example.food.dto.order.OrderItemRequest;
import com.example.food.dto.order.OrderResponse;
import com.example.food.dto.order.PlaceOrderRequest;
import com.example.food.dto.payment.PaymentConfirmationResponse;
import com.example.food.dto.payment.PaymentVerificationRequest;
import com.example.food.entity.*;
import com.example.food.enums.OrderStatus;
import com.example.food.enums.PaymentStatus;
import com.example.food.repository.CateringOrderRepo;
import com.example.food.repository.CateringServiceRepo;
import com.example.food.repository.MenuItemRepo;
import com.example.food.repository.UserRepo;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final CateringOrderRepo orderRepo;
    private final MenuItemRepo menuRepo;
    private final CateringServiceRepo serviceRepo;
    private final UserRepo userRepo;
    private final CartService cartService;
    private final RazorpayService razorpayService;
    private final EmailService emailService;

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request, String email) {
        //Load User and Service
        Users user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        CateringService cateringService = serviceRepo.findById(request.getCateringServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catering service not found"));

        // Validate service is available
        if (!cateringService.getAvailable()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service is currently unavailable");
        }

        // Validate minimum order quantity
        if (request.getGuestCount() < cateringService.getMinOrderQuantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Minimum order quantity is " + cateringService.getMinOrderQuantity());
        }

        String paymentMethod = request.getPaymentMethod() != null ?
                request.getPaymentMethod().toUpperCase() : "COD";

        //Create Order
        CateringOrder order = new CateringOrder();
        order.setCustomer(user);
        order.setCateringService(cateringService);
        order.setEventDate(request.getEventDate());
        order.setEventAddress(request.getEventAddress());
        order.setEventType(request.getEventType());
        order.setGuestCount(request.getGuestCount());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(PaymentStatus.PENDING);

        //Fetch all menu items
        List<Long> menuIds = request.getItems().stream()
                .map(OrderItemRequest::getMenuItemId)
                .distinct()
                .toList();

        Map<Long, MenuItem> menuMap = menuRepo.findAllById(menuIds).stream()
                .collect(Collectors.toMap(MenuItem::getId, m -> m));

        //Validate all items exist
        if (menuMap.size() != menuIds.size()) {
            List<Long> missing = new ArrayList<>(menuIds);
            missing.removeAll(menuMap.keySet());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Menu items not found: " + missing);
        }

        //Calculate totals and create order items
        double subtotal = 0.0;
        int totalQuantity = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menu = menuMap.get(itemReq.getMenuItemId());

            if (!menu.getCateringService().getServiceId().equals(cateringService.getServiceId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Menu item '" + menu.getName() + "' does not belong to this service");
            }

            OrderItem item = new OrderItem();
            item.setMenuItem(menu);
            item.setItemName(menu.getName());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(menu.getPrice());
            item.setOrder(order);

            orderItems.add(item);
            subtotal += menu.getPrice() * itemReq.getQuantity();
            totalQuantity += itemReq.getQuantity();
        }

        //Calculate service charge
        double serviceCharge = cateringService.getPricePerPlate() * request.getGuestCount();
        double totalAmount = subtotal + serviceCharge;

        //Set order details
        order.setItems(orderItems);
        order.setSubtotal(roundToTwoDecimals(subtotal));
        order.setServiceCharge(roundToTwoDecimals(serviceCharge));
        order.setTotalAmount(roundToTwoDecimals(totalAmount));
        order.setTotalQuantity(totalQuantity);

        //Create Razorpay Order if payment method is RAZORPAY
        Map<String, Object> razorpayOrderData = null;
        if ("RAZORPAY".equals(paymentMethod)) {
            try {
                String receipt = "ORD-" + System.currentTimeMillis();
                Map<String, String> notes = new HashMap<>();
                notes.put("order_type", "CATERING");
                notes.put("customer_email", email);
                notes.put("event_date", request.getEventDate().toString());
                notes.put("guest_count", String.valueOf(request.getGuestCount()));

                razorpayOrderData = razorpayService.createOrder(totalAmount, receipt, notes);

                if (razorpayOrderData != null && !razorpayOrderData.containsKey("error")) {
                    order.setRazorpayOrderId((String) razorpayOrderData.get("orderId"));
                    log.info("Razorpay order created: {} for amount: ₹{}",
                            order.getRazorpayOrderId(), totalAmount);
                } else {
                    // Fallback to COD if Razorpay fails
                    log.warn("⚠Razorpay order creation failed, falling back to COD");
                    order.setPaymentMethod("COD");
                    razorpayOrderData = null;
                }
            } catch (Exception e) {
                log.error("Razorpay error, falling back to COD: {}", e.getMessage());
                order.setPaymentMethod("COD");
                razorpayOrderData = null;
            }
        }

        //Save order
        CateringOrder savedOrder = orderRepo.save(order);

        //Clear cart if needed
        if (request.isFromCart()) {
            cartService.clearCart(email);
        }

        // Send order confirmation email
        try {
            sendOrderConfirmationEmail(savedOrder);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email: {}", e.getMessage());
        }

        log.info("Order placed successfully: {} by user: {} with payment: {}",
                savedOrder.getOrderId(), email, savedOrder.getPaymentMethod());

        //Build response
        OrderResponse response = mapToOrderResponse(savedOrder);

        //Add Razorpay data to response
        if (razorpayOrderData != null) {
            response.setRazorpayOrderId((String) razorpayOrderData.get("orderId"));
            response.setRazorpayKey((String) razorpayOrderData.get("key"));
            response.setAmount((Double) razorpayOrderData.get("amountRupees"));
            response.setCurrency((String) razorpayOrderData.get("currency"));
        }

        return response;
    }


//     Confirm and update payment status (without user email - for backward compatibility)

    @Transactional
    public PaymentConfirmationResponse confirmAndUpdatePayment(PaymentVerificationRequest request) {
        return confirmAndUpdatePayment(request, null);
    }


//      Confirm and update payment with user email for ownership check
//       FIXED: Added ownership check to prevent IDOR vulnerability
    @Transactional
    public PaymentConfirmationResponse confirmAndUpdatePayment(
            PaymentVerificationRequest request, String userEmail) {

        CateringOrder order = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        //SECURITY FIX: Verify order belongs to authenticated user
        if (userEmail != null && order.getCustomer() != null &&
                !order.getCustomer().getEmail().equals(userEmail)) {
            log.warn("⚠Unauthorized payment confirmation attempt - User: {}, Order: {}",
                    userEmail, request.getOrderId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this order");
        }

        //Validate order state
        if (order.getPaymentStatus() == PaymentStatus.SUCCESS) {
            return PaymentConfirmationResponse.builder()
                    .success(true)
                    .orderId(order.getOrderId())
                    .orderNumber(order.getOrderNumber())
                    .amount(order.getTotalAmount())
                    .message("Payment already processed")
                    .alreadyProcessed(true)
                    .build();
        }

        // Verify signature using SDK
        boolean isSignatureValid = razorpayService.verifyPaymentSignature(
                order.getRazorpayOrderId(),
                request.getPaymentId(),
                request.getSignature()
        );

        if (!isSignatureValid) {
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepo.save(order);
            log.error("Payment signature verification failed for order: {}", order.getOrderId());

            return PaymentConfirmationResponse.builder()
                    .success(false)
                    .orderId(order.getOrderId())
                    .orderNumber(order.getOrderNumber())
                    .message("Payment verification failed. Invalid signature.")
                    .build();
        }

        // Verify with Razorpay API
        boolean isPaymentCaptured = razorpayService.isPaymentSuccessful(request.getPaymentId());

        if (!isPaymentCaptured) {
            String paymentStatus = razorpayService.getPaymentStatus(request.getPaymentId());
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepo.save(order);
            log.error("Payment not captured for order: {}. Status: {}",
                    order.getOrderId(), paymentStatus);

            return PaymentConfirmationResponse.builder()
                    .success(false)
                    .orderId(order.getOrderId())
                    .orderNumber(order.getOrderNumber())
                    .message("Payment not completed. Status: " + paymentStatus)
                    .paymentStatus(paymentStatus)
                    .build();
        }

        //Update order with payment success
        order.setPaymentStatus(PaymentStatus.SUCCESS);
        order.setRazorpayPaymentId(request.getPaymentId());
        order.setRazorpaySignature(request.getSignature());
        order.setPaidAt(LocalDateTime.now());
        order.setStatus(OrderStatus.CONFIRMED);

        orderRepo.save(order);

        // Send payment confirmation email
        try {
            sendPaymentConfirmationEmail(order);
        } catch (Exception e) {
            log.error("Failed to send payment confirmation email: {}", e.getMessage());
        }

        log.info("Payment confirmed for order: {}, amount: ₹{}, paymentId: {}",
                order.getOrderId(), order.getTotalAmount(), request.getPaymentId());

        return PaymentConfirmationResponse.builder()
                .success(true)
                .orderId(order.getOrderId())
                .orderNumber(order.getOrderNumber())
                .amount(order.getTotalAmount())
                .paymentId(request.getPaymentId())
                .message("Payment successful! Your order is confirmed.")
                .build();
    }

    @Transactional
    public PaymentConfirmationResponse confirmPayment(Long orderId, String paymentId, String signature) {
        PaymentVerificationRequest request = new PaymentVerificationRequest();
        request.setOrderId(orderId);
        request.setPaymentId(paymentId);
        request.setSignature(signature);
        return confirmAndUpdatePayment(request);
    }

    @Transactional
    public Map<String, Object> getPaymentStatus(Long orderId, String email) {
        CateringOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Security check
        if (!order.getCustomer().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getOrderId());
        response.put("orderNumber", order.getOrderNumber());
        response.put("paymentMethod", order.getPaymentMethod());
        response.put("paymentStatus", order.getPaymentStatus());
        response.put("orderStatus", order.getStatus());
        response.put("totalAmount", order.getTotalAmount());
        response.put("paidAt", order.getPaidAt());

        if (order.getRazorpayPaymentId() != null) {
            Map<String, Object> paymentDetails = razorpayService.fetchPaymentDetails(order.getRazorpayPaymentId());
            response.put("paymentDetails", paymentDetails);
        }

        return response;
    }

    @Transactional
    public Map<String, Object> retryPayment(Long orderId, String email) {
        CateringOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Security check
        if (!order.getCustomer().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        // Validate order can be retried
        if (order.getPaymentStatus() == PaymentStatus.SUCCESS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment already completed");
        }

        if (!"RAZORPAY".equals(order.getPaymentMethod())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is not a Razorpay order");
        }

        // Check if order is expired
        if (order.getOrderDate().plusMinutes(30).isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Order expired. Please place a new order.");
        }

        try {
            String receipt = "RETRY-" + order.getOrderNumber() + "-" + System.currentTimeMillis();
            Map<String, String> notes = new HashMap<>();
            notes.put("order_id", String.valueOf(order.getOrderId()));
            notes.put("retry", "true");
            notes.put("customer_email", email);

            Map<String, Object> razorpayOrderData = razorpayService.createOrder(
                    order.getTotalAmount(), receipt, notes);

            order.setRazorpayOrderId((String) razorpayOrderData.get("orderId"));
            orderRepo.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getOrderId());
            response.put("orderNumber", order.getOrderNumber());
            response.put("amount", order.getTotalAmount());
            response.put("razorpayOrderId", razorpayOrderData.get("orderId"));
            response.put("razorpayKey", razorpayOrderData.get("key"));
            response.put("currency", razorpayOrderData.get("currency"));
            response.put("prefill", Map.of(
                    "email", email,
                    "contact", order.getCustomer().getPhone()
            ));

            log.info("Payment retry initiated for order: {}", order.getOrderId());

            return response;

        } catch (RazorpayException e) {
            log.error("Failed to retry payment for order: {}: {}", orderId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Payment retry failed: " + e.getMessage());
        }
    }

    @Transactional
    public void cancelOrder(Long orderId, String email) {
        CateringOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getCustomer().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only pending or confirmed orders can be cancelled. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledDate(LocalDateTime.now());

        // Mark payment as failed if it was pending
        if (order.getPaymentStatus() == PaymentStatus.PENDING) {
            order.setPaymentStatus(PaymentStatus.FAILED);
        }

        orderRepo.save(order);

        log.info("Order {} cancelled by customer {}", orderId, email);
    }

    // Email methods
    private void sendOrderConfirmationEmail(CateringOrder order) {
        String subject = String.format("Order Confirmation - %s", order.getOrderNumber());
        String content = buildOrderEmailContent(order, "confirmed");
        emailService.sendEmail(order.getCustomer().getEmail(), subject, content);
    }

    private void sendPaymentConfirmationEmail(CateringOrder order) {
        String subject = String.format("Payment Confirmed - Order %s", order.getOrderNumber());
        String content = buildPaymentEmailContent(order);
        emailService.sendEmail(order.getCustomer().getEmail(), subject, content);
    }

    private String buildOrderEmailContent(CateringOrder order, String type) {
        return String.format("""
            Dear %s,
            
            Your order %s has been %s.
            
            Order Details:
            - Order Number: %s
            - Event Date: %s
            - Guest Count: %d
            - Total Amount: ₹%.2f
            - Payment Method: %s
            
            Thank you for choosing our catering service!
            
            Best regards,
            Food Catering Team
            """,
                order.getCustomer().getUsername(),
                order.getOrderNumber(),
                type,
                order.getOrderNumber(),
                order.getEventDate(),
                order.getGuestCount(),
                order.getTotalAmount(),
                order.getPaymentMethod()
        );
    }

    private String buildPaymentEmailContent(CateringOrder order) {
        return String.format("""
            Dear %s,
            
            Your payment for order %s has been confirmed!
            
            Payment Details:
            - Amount Paid: ₹%.2f
            - Payment Method: %s
            - Transaction ID: %s
            - Payment Date: %s
            
            Your order is now confirmed and being processed.
            
            Thank you for your payment!
            
            Best regards,
            Food Catering Team
            """,
                order.getCustomer().getUsername(),
                order.getOrderNumber(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getRazorpayPaymentId(),
                order.getPaidAt()
        );
    }

    public List<OrderResponse> getMyOrders(String email) {
        return orderRepo.findByCustomer_EmailOrderByOrderDateDesc(email).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public Page<OrderResponse> getMyOrdersPaginated(String email, Pageable pageable) {
        return orderRepo.findByCustomer_EmailOrderByOrderDateDesc(email, pageable)
                .map(this::mapToOrderResponse);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus, String vendorEmail) {
        CateringOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getCateringService().getVendor().getEmail().equals(vendorEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredDate(LocalDateTime.now());
        }

        log.info("Order {} status updated to {} by vendor {}", orderId, newStatus, vendorEmail);

        return mapToOrderResponse(orderRepo.save(order));
    }

    public Page<OrderResponse> getVendorOrders(String email, OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepo.findByCateringService_Vendor_EmailAndStatusOrderByOrderDateDesc(email, status, pageable)
                    .map(this::mapToOrderResponse);
        }
        return orderRepo.findByCateringService_Vendor_EmailOrderByOrderDateDesc(email, pageable)
                .map(this::mapToOrderResponse);
    }

    public OrderResponse getOrderDetails(Long orderId, String email) {
        CateringOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        Users user = userRepo.findByEmail(email);

        boolean isCustomer = user.getRole().name().equals("CUSTOMER");
        boolean isVendor = user.getRole().name().equals("VENDOR");

        if (isCustomer && !order.getCustomer().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (isVendor && !order.getCateringService().getVendor().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return mapToOrderResponse(order);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus newStatus) {
        if (current == newStatus) return;

        boolean valid = switch (current) {
            case PENDING -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
            case CONFIRMED -> newStatus == OrderStatus.PREPARING || newStatus == OrderStatus.CANCELLED;
            case PREPARING -> newStatus == OrderStatus.READY || newStatus == OrderStatus.CANCELLED;
            case READY -> newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.CANCELLED;
            case DELIVERED, CANCELLED -> false;
        };

        if (!valid) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Invalid status transition from %s to %s", current, newStatus));
        }
    }

    private OrderResponse mapToOrderResponse(CateringOrder order) {
        OrderResponse response = OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomer().getUsername())
                .customerEmail(order.getCustomer().getEmail())
                .serviceName(order.getCateringService().getServiceName())
                .eventDate(order.getEventDate())
                .eventType(order.getEventType())
                .guestCount(order.getGuestCount())
                .subtotal(order.getSubtotal())
                .serviceCharge(order.getServiceCharge())
                .totalAmount(order.getTotalAmount())
                .totalQuantity(order.getTotalQuantity())
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null)
                .availablePaymentMethods(getAvailablePaymentMethods())
                .build();

        return response;
    }


//     Get available payment methods for frontend
    private Map<String, Boolean> getAvailablePaymentMethods() {
        Map<String, Boolean> methods = new HashMap<>();

        // COD is always available
        methods.put("COD", true);

        // Razorpay availability depends on service configuration
        methods.put("RAZORPAY", isRazorpayAvailable());

        return methods;
    }


//     Check if Razorpay is properly configured and available

    private boolean isRazorpayAvailable() {
        try {
            return razorpayService != null && razorpayService.isConfigured();
        } catch (Exception e) {
            log.warn("Razorpay not available: {}", e.getMessage());
            return false;
        }
    }

    private double roundToTwoDecimals(double value) {
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }
}