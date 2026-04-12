package com.example.food.dto;

import lombok.Data;

@Data
public class MenuItemRequest {
    private String name;
    private String category;
    private Double price;
}