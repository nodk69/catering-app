package com.example.food.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    public CompletableFuture<Boolean> sendVerificationEmail(String to, String name, String code, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Verify Your Email - FoodCatering");

            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("code", code);
            context.setVariable("token", token);
            context.setVariable("verificationLink", baseUrl + "/verify?token=" + token);
            context.setVariable("expiryHours", 24);
            context.setVariable("currentYear", java.time.Year.now().getValue());

            String htmlContent = templateEngine.process("verification-email", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", to);

            return CompletableFuture.completedFuture(true);

        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}", to, e);
            return CompletableFuture.completedFuture(false);
        }
    }

    @Async
    public CompletableFuture<Boolean> sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Welcome to FoodCatering!");

            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("loginLink", baseUrl + "/login");
            context.setVariable("exploreLink", baseUrl + "/catering");
            context.setVariable("currentYear", java.time.Year.now().getValue());

            String htmlContent = templateEngine.process("welcome-email", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent successfully to: {}", to);

            return CompletableFuture.completedFuture(true);

        } catch (MessagingException e) {
            log.error("Failed to send welcome email to: {}", to, e);
            return CompletableFuture.completedFuture(false);
        }
    }


    @Async
    public void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, false); // Plain text

            mailSender.send(message);
            log.info("📧 Email sent successfully to: {} with subject: {}", to, subject);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}