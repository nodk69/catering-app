package com.example.food.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
}