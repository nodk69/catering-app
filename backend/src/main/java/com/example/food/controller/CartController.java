package com.example.food.controller;

import com.example.food.dto.*;
import com.example.food.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ApiResponse addToCart(@Valid @RequestBody CartItemRequest request, Principal principal) {
        return ApiResponse.builder()
                .message("Item added to cart")
                .data(cartService.addToCart(principal.getName(), request))
                .build();
    }

    @GetMapping
    public ApiResponse getCart(Principal principal) {
        return ApiResponse.builder()
                .message("Cart retrieved")
                .data(cartService.getCart(principal.getName()))
                .build();
    }

    @PutMapping("/item/{cartItemId}")
    public ApiResponse updateQuantity(@PathVariable Long cartItemId,
                                      @RequestParam int quantity,
                                      Principal principal) {
        return ApiResponse.builder()
                .message("Cart updated")
                .data(cartService.updateQuantity(principal.getName(), cartItemId, quantity))
                .build();
    }

    @DeleteMapping("/item/{cartItemId}")
    public ApiResponse removeItem(@PathVariable Long cartItemId, Principal principal) {
        cartService.removeItem(principal.getName(), cartItemId);
        return ApiResponse.builder().message("Item removed").build();
    }

    @DeleteMapping("/clear")
    public ApiResponse clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ApiResponse.builder().message("Cart cleared").build();
    }
}