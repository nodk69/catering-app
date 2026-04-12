package com.example.food.dto;

import lombok.Data;

@Data
public class CreateCateringServiceRequest {
    private String serviceName;
    private String description;
    private Double pricePerPlate;
    private Integer minOrderQuantity;
}