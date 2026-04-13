package com.example.food.dto.verification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {

    private boolean verified;
    private String message;
    private String email;
    private LocalDateTime verifiedAt;
    private int remainingAttempts;
    private boolean canResend;
    private LocalDateTime nextResendTime;
}