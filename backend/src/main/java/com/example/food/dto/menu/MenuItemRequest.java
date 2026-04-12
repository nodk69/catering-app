package com.example.food.dto.menu;

import lombok.Data;

@Data
public class MenuItemRequest {
    private String name;
    private String category;
    private Double price;
}
