package com.example.food.dto.payment;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private Long orderId;
    private String paymentId;
    private String signature;
    private String razorpayOrderId;
}



