package com.example.food.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuItemResponse {
    private Long id;
    private String name;
    private String category;
    private Double price;
    private Boolean available;
}
