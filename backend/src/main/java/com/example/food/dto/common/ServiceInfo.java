package com.example.food.dto.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ServiceInfo {
    private Long serviceId;
    private String serviceName;
    private String vendorBusinessName;
}
