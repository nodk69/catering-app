package com.example.food.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    CUSTOMER,
    VENDOR,
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        if (value == null || value.isEmpty()) {
            return CUSTOMER;
        }

        // Remove "ROLE_" prefix if present and convert to uppercase
        String normalized = value.replace("ROLE_", "").toUpperCase();

        try {
            return Role.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            // Default to CUSTOMER if invalid role
            return CUSTOMER;
        }
    }

    @JsonValue
    public String toValue() {
        return "ROLE_" + this.name();
    }
}
