package com.example.food.dto;

import com.example.food.enums.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Role role;

    // Vendor-specific (optional)
    private String businessName;

}