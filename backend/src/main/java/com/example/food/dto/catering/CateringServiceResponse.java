package com.example.food.dto.catering;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CateringServiceResponse {
    private Long serviceId;
    private String serviceName;
    private String description;
    private Double pricePerPlate;
    private Integer minOrderQuantity;
    private String vendorBusinessName; // Extract only what's needed
    private String vendorEmail;
}
