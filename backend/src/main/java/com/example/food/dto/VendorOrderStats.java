package com.example.food.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VendorOrderStats {
    private Long totalOrders;
    private Long pendingOrders;
    private Long completedOrders;
    private Double totalRevenue;
}
