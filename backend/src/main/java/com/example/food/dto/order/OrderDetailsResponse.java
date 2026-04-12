package com.example.food.dto.order;

import com.example.food.dto.common.ServiceInfo;
import com.example.food.dto.customer.CustomerInfo;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDetailsResponse {
    private Long orderId;
    private CustomerInfo customer;
    private ServiceInfo service;
    private List<OrderItemResponse> items;
    private LocalDate eventDate;
    private String eventAddress;
    private String eventType;
    private Integer guestCount;
    private Double subtotal;
    private Double serviceCharge;
    private Double totalAmount;
    private String status;
    private LocalDateTime orderDate;
}
