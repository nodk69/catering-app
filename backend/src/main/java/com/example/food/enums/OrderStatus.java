package com.example.food.enums;

public enum OrderStatus {
    PENDING,      // Order placed, waiting for vendor confirmation
    CONFIRMED,    // Vendor confirmed the order
    PREPARING,    // Food is being prepared
    READY,        // Food is ready for delivery/pickup
    DELIVERED,    // Order has been delivered
    CANCELLED,    // Order was cancelled
}
