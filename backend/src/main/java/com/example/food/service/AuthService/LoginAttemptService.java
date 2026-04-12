package com.example.food.service.AuthService;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> lockoutCache = new ConcurrentHashMap<>();

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    public void loginSucceeded(String email) {
        attemptsCache.remove(email);
        lockoutCache.remove(email);
    }

    public void loginFailed(String email) {
        int attempts = attemptsCache.getOrDefault(email, 0) + 1;
        attemptsCache.put(email, attempts);

        if (attempts >= MAX_ATTEMPTS) {
            lockoutCache.put(email, LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
        }
    }

    public boolean isBlocked(String email) {
        LocalDateTime lockoutTime = lockoutCache.get(email);
        if (lockoutTime == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(lockoutTime)) {
            lockoutCache.remove(email);
            attemptsCache.remove(email);
            return false;
        }
        return true;
    }

    public int getRemainingAttempts(String email) {
        if (isBlocked(email)) {
            return 0;
        }
        int attempts = attemptsCache.getOrDefault(email, 0);
        return MAX_ATTEMPTS - attempts;
    }
}
