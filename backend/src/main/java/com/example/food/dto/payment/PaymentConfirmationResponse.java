package com.example.food.dto.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentConfirmationResponse {
    private boolean success;
    private Long orderId;
    private String orderNumber;
    private Double amount;
    private String paymentId;
    private String message;
    private String paymentStatus;
    private boolean alreadyProcessed;
}
