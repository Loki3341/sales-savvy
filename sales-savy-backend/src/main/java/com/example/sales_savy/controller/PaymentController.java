package com.example.sales_savy.controller;

import com.example.sales_savy.dto.PaymentRequest;
import com.example.sales_savy.dto.PaymentResponse;
import com.example.sales_savy.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5174")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentResponse response = paymentService.createPayment(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment creation failed"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String orderId = request.get("orderId");
            String paymentId = request.get("paymentId");
            String signature = request.get("signature");

            boolean isValid = paymentService.verifyPayment(orderId, paymentId, signature);
            
            if (isValid) {
                paymentService.handleSuccessfulPayment(orderId, paymentId);
                return ResponseEntity.ok(Map.of("message", "Payment verified successfully"));
            } else {
                paymentService.handleFailedPayment(orderId);
                return ResponseEntity.badRequest().body(Map.of("error", "Payment verification failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment verification error"));
        }
    }
}