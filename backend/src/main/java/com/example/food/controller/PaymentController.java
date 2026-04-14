package com.example.food.controller;

import com.example.food.dto.common.ApiResponse;
import com.example.food.dto.payment.PaymentConfirmationResponse;
import com.example.food.dto.payment.PaymentVerificationRequest;
import com.example.food.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPaymentConfig() {
        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
                .message("Payment configuration retrieved")
                .data(Map.of("key", razorpayKeyId))
                .build());
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<PaymentConfirmationResponse>> verifyPayment(
            @RequestBody PaymentVerificationRequest request) {

        PaymentConfirmationResponse response = orderService.confirmAndUpdatePayment(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.<PaymentConfirmationResponse>builder()
                    .message(response.getMessage())
                    .data(response)
                    .build());
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.<PaymentConfirmationResponse>builder()
                    .message(response.getMessage())
                    .data(response)
                    .build());
        }
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaymentStatus(
            @PathVariable Long orderId,
            Principal principal) {

        Map<String, Object> status = orderService.getPaymentStatus(orderId, principal.getName());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .message("Payment status retrieved")
                .data(status)
                .build());
    }

    @PostMapping("/retry/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> retryPayment(
            @PathVariable Long orderId,
            Principal principal) {

        Map<String, Object> retryData = orderService.retryPayment(orderId, principal.getName());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .message("Payment retry initiated")
                .data(retryData)
                .build());
    }
}