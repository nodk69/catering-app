package com.example.food.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CartResponse {
    private List<CartItemResponse> items;
    private Double subtotal;
    private Integer totalItems;
    private Long serviceId;
    private String serviceName;
}
