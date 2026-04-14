package com.example.food.dto.order;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String serviceName;
    private LocalDate eventDate;
    private String eventType;
    private Integer guestCount;
    private Double subtotal;
    private Double serviceCharge;
    private Double totalAmount;
    private Integer totalQuantity;
    private String status;
    private LocalDateTime orderDate;

    // Payment fields
    private String paymentMethod;  // The ACTUAL chosen method (COD/RAZORPAY)
    private String paymentStatus;  // PENDING/SUCCESS/FAILED/REFUNDED

    // Razorpay specific fields
    private String razorpayOrderId;
    private String razorpayKey;
    private Double amount;
    private String currency;

    // Available options for frontend (NOT the chosen one)
    private Map<String, Boolean> availablePaymentMethods;
}