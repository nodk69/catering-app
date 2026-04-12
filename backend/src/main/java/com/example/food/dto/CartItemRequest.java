package com.example.food.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long menuItemId;
    private Integer quantity;
    private Long serviceId;
}
