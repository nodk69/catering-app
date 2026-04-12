package com.example.food.controller;


import com.example.food.dto.auth.LoginRequest;
import com.example.food.dto.auth.LoginResponse;
import com.example.food.dto.auth.RegisterRequest;
import com.example.food.dto.common.UserResponse;
import com.example.food.service.AuthService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private UserService service;


    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return service.register(request);
    }


    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return service.verify(request);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(Map.of(
                "email", authentication.getName(),
                "role", authentication.getAuthorities().iterator().next().getAuthority()
        ));
    }
}
