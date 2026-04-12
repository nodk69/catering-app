package com.example.food.service.AuthService;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Date;

@Service
public class TokenBlacklistService {
    private final ConcurrentHashMap<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String token, long expirationTime) {
        blacklistedTokens.put(token, expirationTime);
        // Clean up expired tokens periodically
        cleanupExpiredTokens();
    }

    public boolean isTokenBlacklisted(String token) {
        cleanupExpiredTokens();
        return blacklistedTokens.containsKey(token);
    }

    private void cleanupExpiredTokens() {
        long now = System.currentTimeMillis();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue() < now);
    }
}