package com.example.food.controller;

import com.example.food.dto.common.ApiResponse;
import com.example.food.entity.CateringService;
import com.example.food.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/catering")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // View pending services
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<CateringService> getPending() {
        return adminService.getPendingServices();
    }

    // Approve service
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public ApiResponse approve(@PathVariable Long id) {
        CateringService service = adminService.approveService(id);
        return ApiResponse.builder()
                .message("Service approved successfully")
                .data(service.getServiceName()) // Avoid returning the whole object to prevent recursion
                .build();
    }

    // Reject service
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reject/{id}")
    public ApiResponse reject(@PathVariable Long id) {
        CateringService service = adminService.rejectService(id);
        return ApiResponse.builder()
                .message("Service rejected")
                .data(service.getServiceName())
                .build();
    }
}
