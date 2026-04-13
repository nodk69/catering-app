package com.example.food.service;

import com.example.food.dto.verification.VerificationResponse;
import com.example.food.entity.EmailVerificationToken;
import com.example.food.entity.Users;
import com.example.food.repository.EmailVerificationTokenRepository;
import com.example.food.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepo userRepo;
    private final EmailService emailService;

    @Value("${app.verification.code-length:6}")
    private int codeLength;

    @Value("${app.verification.code-expiry-minutes:30}")
    private int expiryMinutes;

    @Value("${app.verification.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.verification.rate-limit-seconds:60}")
    private int rateLimitSeconds;

    private final SecureRandom secureRandom = new SecureRandom();


    public void sendVerificationEmail(String email, String name) {
        // Validate email
        Users user = userRepo.findByEmail(email.toLowerCase().trim());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (user.isEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already verified");
        }

        //Rate limiting check
        checkRateLimit(email);

        //Generate verification data
        String code = generateVerificationCode();
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(expiryMinutes);

        //Save token in a SEPARATE transaction
        saveVerificationToken(email, code, token, expiryDate);

        //Log the code for testing
        log.info("========================================");
        log.info("VERIFICATION CODE for {}: {}", email, code);
        log.info("========================================");

        //Send email - catch any exception so it doesn't propagate
        try {
            emailService.sendVerificationEmail(email, name, code, token);
            log.info("Verification email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send verification email: {}", e.getMessage());
            log.info("Use the code above to verify manually");
            //DO NOT RE-THROW - token is already saved
        }
    }

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void saveVerificationToken(String email, String code, String token, LocalDateTime expiryDate) {
        // Delete any existing unverified tokens
        tokenRepository.deleteByEmail(email);

        // Save new token
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .email(email)
                .verificationCode(code)
                .expiryDate(expiryDate)
                .verified(false)
                .attempts(0)
                .build();

        tokenRepository.save(verificationToken);
        log.info("Verification token saved for: {}", email);
    }


    @Transactional
    public VerificationResponse verifyEmail(String email, String code) {
        String normalizedEmail = email.toLowerCase().trim();

        // Find token
        EmailVerificationToken token = tokenRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No verification request found for this email"));

        // Check if already verified
        if (token.isVerified()) {
            return VerificationResponse.builder()
                    .verified(true)
                    .message("Email already verified")
                    .email(normalizedEmail)
                    .verifiedAt(token.getVerifiedAt())
                    .build();
        }

        //Check if expired
        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Verification code has expired. Please request a new one.");
        }

        //Check attempts
        if (!token.canAttempt()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Maximum verification attempts exceeded. Please request a new code.");
        }

        //Verify code
        if (!token.getVerificationCode().equals(code)) {
            token.incrementAttempts();
            tokenRepository.save(token);

            int remaining = maxAttempts - token.getAttempts();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Invalid verification code. %d attempts remaining.", remaining));
        }

        //Mark as verified
        token.setVerified(true);
        token.setVerifiedAt(LocalDateTime.now());
        tokenRepository.save(token);

        //Update user
        Users user = userRepo.findByEmail(normalizedEmail);
        if (user != null) {
            user.setEmailVerified(true);
            user.setEmailVerifiedAt(LocalDateTime.now());
            userRepo.save(user);

            //Send welcome email (non-blocking)
            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
            } catch (Exception e) {
                log.error("Failed to send welcome email: {}", e.getMessage());
            }
        }

        log.info("Email verified successfully: {}", normalizedEmail);

        return VerificationResponse.builder()
                .verified(true)
                .message("Email verified successfully")
                .email(normalizedEmail)
                .verifiedAt(token.getVerifiedAt())
                .build();
    }


    public boolean isEmailVerified(String email) {
        return tokenRepository.existsByEmailAndVerifiedTrue(email.toLowerCase().trim());
    }


    private String generateVerificationCode() {
        int max = (int) Math.pow(10, codeLength);
        int code = secureRandom.nextInt(max);
        return String.format("%0" + codeLength + "d", code);
    }


    private void checkRateLimit(String email) {
        LocalDateTime since = LocalDateTime.now().minusSeconds(rateLimitSeconds);
        long recentRequests = tokenRepository.countRecentRequests(email, since);

        if (recentRequests >= 3) {
            long secondsToWait = rateLimitSeconds -
                    java.time.Duration.between(since, LocalDateTime.now()).getSeconds();
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    String.format("Too many requests. Please wait %d seconds.", Math.max(1, secondsToWait)));
        }
    }


    public VerificationResponse getVerificationStatus(String email) {
        String normalizedEmail = email.toLowerCase().trim();

        Users user = userRepo.findByEmail(normalizedEmail);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (user.isEmailVerified()) {
            return VerificationResponse.builder()
                    .verified(true)
                    .message("Email is verified")
                    .email(normalizedEmail)
                    .verifiedAt(user.getEmailVerifiedAt())
                    .build();
        }

        EmailVerificationToken token = tokenRepository.findByEmail(normalizedEmail).orElse(null);

        int remainingAttempts = token != null ? maxAttempts - token.getAttempts() : maxAttempts;
        boolean canResend = token == null || token.getCreatedAt().plusSeconds(rateLimitSeconds).isBefore(LocalDateTime.now());
        LocalDateTime nextResendTime = token != null && !canResend
                ? token.getCreatedAt().plusSeconds(rateLimitSeconds)
                : null;

        return VerificationResponse.builder()
                .verified(false)
                .message("Email not verified")
                .email(normalizedEmail)
                .remainingAttempts(remainingAttempts)
                .canResend(canResend)
                .nextResendTime(nextResendTime)
                .build();
    }


    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Cleaned up expired verification tokens");
    }
}