package com.example.food.dto.customer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerInfo {
    private Long userId;
    private String username;
    private String email;
    private String phone;
}
