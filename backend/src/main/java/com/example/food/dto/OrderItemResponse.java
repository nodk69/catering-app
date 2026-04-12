package com.example.food.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private Double price;
    private Double subtotal;
}
