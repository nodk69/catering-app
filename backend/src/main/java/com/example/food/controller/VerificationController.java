package com.example.food.controller;

import com.example.food.dto.common.ApiResponse;
import com.example.food.dto.verification.ResendVerificationRequest;
import com.example.food.dto.verification.VerificationRequest;
import com.example.food.dto.verification.VerificationResponse;
import com.example.food.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.base-url}")
public class VerificationController {

    private final EmailVerificationService verificationService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendVerification(
            @Valid @RequestBody ResendVerificationRequest request) {

        verificationService.sendVerificationEmail(request.getEmail(), request.getName());

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Verification code sent successfully")
                .build());
    }


    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<VerificationResponse>> verifyEmail(
            @Valid @RequestBody VerificationRequest request) {

        VerificationResponse response = verificationService.verifyEmail(
                request.getEmail(),
                request.getCode()
        );

        return ResponseEntity.ok(ApiResponse.<VerificationResponse>builder()
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<VerificationResponse>> checkStatus(
            @RequestParam String email) {

        VerificationResponse response = verificationService.getVerificationStatus(email);

        return ResponseEntity.ok(ApiResponse.<VerificationResponse>builder()
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @PostMapping("/resend")
    public ResponseEntity<ApiResponse<Void>> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request) {

        verificationService.sendVerificationEmail(request.getEmail(), request.getName());

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("New verification code sent successfully")
                .build());
    }
}