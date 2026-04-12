package com.example.food.controller;

import com.example.food.dto.ApiResponse;
import com.example.food.dto.CateringServiceResponse;
import com.example.food.dto.CreateCateringServiceRequest;
import com.example.food.entity.CateringService;
import com.example.food.entity.Users;
import com.example.food.service.CateringServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/vendor/catering")
public class CateringController {

    @Autowired
    private CateringServiceService service;

    @PreAuthorize("hasRole('VENDOR')")
    @PostMapping("/create")
    public ApiResponse create(@RequestBody CreateCateringServiceRequest request,
                              Principal principal) {

        return ApiResponse.builder()
                .message("Service created")
                .data(service.createService(request, principal.getName()))
                .build();
    }

    @PreAuthorize("hasAnyRole('VENDOR','CUSTOMER','ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<CateringServiceResponse>> getAll() {
        List<CateringServiceResponse> services = service.getAllApprovedServices();
        return ResponseEntity.ok(services);
    }

}
