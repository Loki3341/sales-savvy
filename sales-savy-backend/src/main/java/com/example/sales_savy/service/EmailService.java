package com.example.sales_savy.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Sales Savvy - Email Verification");
        message.setText("Please click the following link to verify your email: "
                + "http://localhost:8080/api/auth/verify?token=" + verificationToken
                + "\n\nThank you for registering with Sales Savvy!");
        mailSender.send(message);
    }

    public void sendOrderConfirmation(String to, String orderId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Sales Savvy - Order Confirmation");
        message.setText("Your order " + orderId + " has been confirmed successfully!\n\n"
                + "Thank you for shopping with Sales Savvy!");
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Sales Savvy - Password Reset");
        message.setText("Click the link to reset your password:\n\n"
                + "http://localhost:5173/reset-password?token=" + resetToken
                + "\n\nThis link will expire in 1 hour.\n\n"
                + "If you didn't request this reset, please ignore this email.");
        mailSender.send(message);
    }
}