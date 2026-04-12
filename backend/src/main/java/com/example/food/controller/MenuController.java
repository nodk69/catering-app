package com.example.food.controller;

import com.example.food.dto.common.ApiResponse;
import com.example.food.dto.menu.BulkMenuItemRequest;
import com.example.food.dto.menu.MenuItemRequest;
import com.example.food.entity.MenuItem;
import com.example.food.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/vendor/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService service;

    @PreAuthorize("hasRole('VENDOR')")
    @PostMapping("/add/{serviceId}")
    public ApiResponse addMenu(@PathVariable Long serviceId,
                               @RequestBody MenuItemRequest request,
                               Principal principal) {

        return ApiResponse.builder()
                .message("Menu item added successfully")
                .data(service.addMenu(serviceId, request, principal.getName()))
                .build();
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<List<MenuItem>> getMenu(@PathVariable Long serviceId) {
        return ResponseEntity.ok(service.getMenuByService(serviceId));
    }

    @PreAuthorize("hasRole('VENDOR')")
    @PostMapping("/add-bulk/{serviceId}")
    public ApiResponse addBulkMenu(@PathVariable Long serviceId,
                                   @RequestBody BulkMenuItemRequest request,
                                   Principal principal) {

        List<MenuItem> savedItems = service.addBulkMenu(serviceId, request, principal.getName());

        return ApiResponse.builder()
                .message(savedItems.size() + " menu items added successfully")
                .data(savedItems)
                .build();
    }
}
