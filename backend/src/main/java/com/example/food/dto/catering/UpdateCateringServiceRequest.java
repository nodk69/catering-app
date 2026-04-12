package com.example.food.dto.catering;

import lombok.Data;

@Data
public class UpdateCateringServiceRequest {
    private String serviceName;
    private String description;
    private Double pricePerPlate;
    private Integer minOrderQuantity;
}
