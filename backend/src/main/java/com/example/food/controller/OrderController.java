package com.example.food.controller;

import com.example.food.dto.ApiResponse;
import com.example.food.dto.OrderResponse;
import com.example.food.dto.PlaceOrderRequest;
import com.example.food.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/customer/order")
public class OrderController {

    @Autowired
    private OrderService service;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/place")
    public ApiResponse placeOrder(@RequestBody PlaceOrderRequest request,
                                  Principal principal) {

        return ApiResponse.builder()
                .message("Order placed successfully")
                .data(service.placeOrder(request, principal.getName()))
                .build();
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public List<OrderResponse> myOrders(Principal principal) {
        return service.getMyOrders(principal.getName());
    }
}