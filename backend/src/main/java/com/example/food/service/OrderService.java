package com.example.food.service;

import com.example.food.dto.OrderItemRequest;
import com.example.food.dto.OrderResponse;
import com.example.food.dto.PlaceOrderRequest;
import com.example.food.entity.*;
import com.example.food.enums.OrderStatus;
import com.example.food.repository.CateringOrderRepo;
import com.example.food.repository.CateringServiceRepo;
import com.example.food.repository.MenuItemRepo;
import com.example.food.repository.UserRepo;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final CateringOrderRepo orderRepo;
    private final MenuItemRepo menuRepo;
    private final CateringServiceRepo serviceRepo;
    private final UserRepo userRepo;
    private final CartService cartService; // Optional: if using cart

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request, String email) {
        // 1. Load User and Service
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

        // 2. Create Order
        CateringOrder order = new CateringOrder();
        order.setCustomer(user);
        order.setCateringService(cateringService);
        order.setEventDate(request.getEventDate());
        order.setEventAddress(request.getEventAddress());
        order.setEventType(request.getEventType());
        order.setGuestCount(request.getGuestCount());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());

        // 3. Fetch all menu items in one query
        List<Long> menuIds = request.getItems().stream()
                .map(OrderItemRequest::getMenuItemId)
                .distinct()
                .toList();

        Map<Long, MenuItem> menuMap = menuRepo.findAllById(menuIds).stream()
                .collect(Collectors.toMap(MenuItem::getId, m -> m));

        // Validate all items exist
        if (menuMap.size() != menuIds.size()) {
            List<Long> missing = new ArrayList<>(menuIds);
            missing.removeAll(menuMap.keySet());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Menu items not found: " + missing);
        }

        // 4. Calculate totals and create order items
        double subtotal = 0.0;
        int totalQuantity = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menu = menuMap.get(itemReq.getMenuItemId());

            // Validate item belongs to the service
            if (!menu.getCateringService().getServiceId().equals(cateringService.getServiceId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Menu item '" + menu.getName() + "' does not belong to this service");
            }

            OrderItem item = new OrderItem();
            item.setMenuItem(menu);
            item.setItemName(menu.getName()); // Snapshot name
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(menu.getPrice()); // Snapshot price
            item.setOrder(order);

            orderItems.add(item);
            subtotal += menu.getPrice() * itemReq.getQuantity();
            totalQuantity += itemReq.getQuantity();
        }

        // 5. Calculate service charge (price per plate * guest count)
        double serviceCharge = cateringService.getPricePerPlate() * request.getGuestCount();
        double totalAmount = subtotal + serviceCharge;

        // 6. Set order details
        order.setItems(orderItems);
        order.setSubtotal(roundToTwoDecimals(subtotal));
        order.setServiceCharge(roundToTwoDecimals(serviceCharge));
        order.setTotalAmount(roundToTwoDecimals(totalAmount));
        order.setTotalQuantity(totalQuantity);

        // 7. Save order
        CateringOrder savedOrder = orderRepo.save(order);

        // 8. Clear cart if order was from cart
        if (request.isFromCart()) {
            cartService.clearCart(email);
        }

        log.info("Order placed successfully: {} by user: {}", savedOrder.getOrderId(), email);

        return mapToOrderResponse(savedOrder);
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

        // Security check
        if (!order.getCateringService().getVendor().getEmail().equals(vendorEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredDate(LocalDateTime.now());
        }

        log.info("Order {} status updated to {} by vendor {}", orderId, newStatus, vendorEmail);

        return mapToOrderResponse(orderRepo.save(order));
    }

    @Transactional
    public void cancelOrder(Long orderId, String email) {
        CateringOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Security check - only customer who placed order can cancel
        if (!order.getCustomer().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        // Only pending or confirmed orders can be cancelled
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only pending or confirmed orders can be cancelled. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledDate(LocalDateTime.now());
        orderRepo.save(order);

        log.info("Order {} cancelled by customer {}", orderId, email);
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

        // Security: Customer can only see their orders, Vendor can see their service orders
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
        if (current == newStatus) {
            return;
        }

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
        return OrderResponse.builder()
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
                .build();
    }

    private double roundToTwoDecimals(double value) {
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }
}