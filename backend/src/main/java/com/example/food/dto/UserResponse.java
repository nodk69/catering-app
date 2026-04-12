package com.example.food.dto;

import com.example.food.enums.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String username;
    private String email;
    private Role role;
    private String businessName; // Added this field
}