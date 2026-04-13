package com.example.food.service;

import com.example.food.dto.auth.LoginRequest;
import com.example.food.dto.auth.LoginResponse;
import com.example.food.dto.auth.RegisterRequest;
import com.example.food.dto.common.UserResponse;
import com.example.food.entity.Users;
import com.example.food.entity.Vendor;
import com.example.food.enums.Role;
import com.example.food.repository.UserRepo;
import com.example.food.repository.VendorRepo;
import com.example.food.service.AuthService.JWTService;
import com.example.food.service.AuthService.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepo userRepo;
    private final VendorRepo vendorRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final LoginAttemptService loginAttemptService;
    private final EmailVerificationService emailVerificationService;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$");

    @Transactional
    public UserResponse register(RegisterRequest request) {
        // Validate email format
        if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email format");
        }

        // Validate password strength
        if (!PASSWORD_PATTERN.matcher(request.getPassword()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
        }

        // Normalize email to lowercase
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        // Check if user exists
        if (userRepo.findByEmail(normalizedEmail) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
        }

        // Prevent users from registering as ADMIN
        Role assignedRole = request.getRole();
        if (assignedRole == null || assignedRole == Role.ADMIN) {
            assignedRole = Role.CUSTOMER;
        }

        // Create and Save User
        Users user = new Users();
        user.setUsername(request.getUsername().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(assignedRole);
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress().trim());
        user.setEmailVerified(false); // Not verified yet
        user.setEnabled(true);

        Users savedUser = userRepo.save(user);

        // Handle Vendor Profile
        String businessName = null;
        if (assignedRole == Role.VENDOR) {
            if (request.getBusinessName() == null || request.getBusinessName().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Business name required for Vendor role");
            }

            Vendor vendor = Vendor.builder()
                    .businessName(request.getBusinessName().trim())
                    .user(savedUser)
                    .build();

            vendorRepo.save(vendor);
            businessName = vendor.getBusinessName();
        }

        // Send verification email
        try {
            emailVerificationService.sendVerificationEmail(normalizedEmail, user.getUsername());
            log.info("Verification email sent to: {}", normalizedEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email: {}", e.getMessage());
            // Don't fail registration if email fails, but log it
        }

        return UserResponse.builder()
                .userId(savedUser.getUserId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .businessName(businessName)
                .emailVerified(false)
                .build();
    }

    public LoginResponse verify(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        // Check if account is locked
        if (loginAttemptService.isBlocked(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Account is temporarily locked. Please try again later.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );

            if (authentication.isAuthenticated()) {
                // Login successful - clear attempts
                loginAttemptService.loginSucceeded(normalizedEmail);

                Users user = userRepo.findByEmail(normalizedEmail);
                if (user == null) {
                    throw new AuthenticationException("User data corrupted") {};
                }

                //Don't allow login until email is verified
                if (!user.isEmailVerified()) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Please verify your email before logging in. Check your inbox for the verification code.");
                }

                String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
                return LoginResponse.builder()
                        .message("Login successful")
                        .token(token)
                        .emailVerified(true)
                        .build();
            }
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(normalizedEmail);
            int remainingAttempts = loginAttemptService.getRemainingAttempts(normalizedEmail);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    String.format("Invalid credentials. %d attempts remaining.", remainingAttempts));
        } catch (ResponseStatusException e) {
            throw e; // Re-throw our custom exception
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed");
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
}