package com.example.food.service;

import com.razorpay.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() {
        try {
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
            log.info("✅ Razorpay client initialized successfully");
        } catch (RazorpayException e) {
            log.error("❌ Failed to initialize Razorpay client: {}", e.getMessage());
            throw new RuntimeException("Payment service initialization failed", e);
        }
    }

    /**
     * Create Razorpay order with retry mechanism
     */
    @Retryable(
            value = {RazorpayException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public Map<String, Object> createOrder(double amount, String receipt, Map<String, String> notes)
            throws RazorpayException {

        validateAmount(amount);

        JSONObject options = new JSONObject();
        options.put("amount", convertToPaise(amount));
        options.put("currency", currency);
        options.put("receipt", receipt);
        options.put("payment_capture", 1);

        if (notes != null && !notes.isEmpty()) {
            options.put("notes", new JSONObject(notes));
        }

        Order order = razorpayClient.orders.create(options);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("amountPaise", order.get("amount"));
        response.put("amountRupees", amount);
        response.put("currency", order.get("currency"));
        response.put("receipt", order.get("receipt"));
        response.put("status", order.get("status"));
        response.put("key", keyId);

        log.info("✅ Razorpay order created: {} for amount: ₹{}", order.get("id"), amount);

        return response;
    }

    /**
     * Verify payment signature using Razorpay SDK
     * ✅ FIXED: Now uses SDK's built-in verification (constant-time comparison)
     */
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            // Use SDK's built-in verification (constant-time comparison)
            Utils.verifyPaymentSignature(attributes, keySecret);

            log.info("✅ Payment signature verified for order: {}", orderId);
            return true;

        } catch (RazorpayException e) {
            log.error("❌ Payment signature verification failed for order {}: {}",
                    orderId, e.getMessage());
            return false;
        }
    }

    /**
     * Fetch payment details from Razorpay
     */
    public Map<String, Object> fetchPaymentDetails(String paymentId) {
        try {
            Payment payment = razorpayClient.payments.fetch(paymentId);

            Map<String, Object> details = new HashMap<>();
            details.put("paymentId", payment.get("id"));
            details.put("amount", payment.get("amount"));
            details.put("status", payment.get("status"));
            details.put("method", payment.get("method"));
            details.put("email", payment.get("email"));
            details.put("contact", payment.get("contact"));
            details.put("createdAt", payment.get("created_at"));
            details.put("captured", payment.get("captured"));

            log.info("✅ Payment details fetched for: {}", paymentId);
            return details;

        } catch (RazorpayException e) {
            log.error("❌ Failed to fetch payment details: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Check if payment is successful
     */
    public boolean isPaymentSuccessful(String paymentId) {
        Map<String, Object> payment = fetchPaymentDetails(paymentId);
        if (payment == null) return false;

        String status = (String) payment.get("status");
        Boolean captured = (Boolean) payment.get("captured");

        return "captured".equals(status) || (captured != null && captured);
    }

    /**
     * Get payment status
     */
    public String getPaymentStatus(String paymentId) {
        Map<String, Object> payment = fetchPaymentDetails(paymentId);
        return payment != null ? (String) payment.get("status") : "unknown";
    }

    // Utility methods
    private int convertToPaise(double amount) {
        return (int) Math.round(amount * 100);
    }

    private void validateAmount(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (amount > 1000000) {
            throw new IllegalArgumentException("Amount exceeds maximum limit of ₹10,00,000");
        }
    }

    /**
     * Check if Razorpay is properly configured
     */
    public boolean isConfigured() {
        try {
            return razorpayClient != null && keyId != null && !keyId.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }
}