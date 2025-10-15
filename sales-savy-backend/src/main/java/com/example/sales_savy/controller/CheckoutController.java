package com.example.sales_savy.controller;

import com.example.sales_savy.dto.CheckoutRequest;
import com.example.sales_savy.dto.OrderResponse;
import com.example.sales_savy.model.User;
import com.example.sales_savy.service.AuthService;
import com.example.sales_savy.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class CheckoutController {
    
    private final CheckoutService checkoutService;
    private final AuthService authService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService, AuthService authService) {
        this.checkoutService = checkoutService;
        this.authService = authService;
        System.out.println("✅ CheckoutController initialized with AuthService");
    }

    @PostMapping("/process")
    public ResponseEntity<?> processCheckout(@RequestBody CheckoutRequest checkoutRequest, 
                                           HttpServletRequest request) {
        try {
            System.out.println("🔄 ========== CHECKOUT PROCESS STARTED ==========");
            
            // Extract user ID from request
            Integer userId = extractUserIdFromRequest(request);
            
            System.out.println("👤 Extracted User ID: " + userId);
            
            if (userId == null) {
                System.out.println("❌ AUTHENTICATION FAILED - No user ID could be extracted");
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Authentication required. Please login again."
                ));
            }
            
            System.out.println("✅ User authorized for checkout - Proceeding with order creation");
            System.out.println("📦 Checkout request data: " + checkoutRequest);
            
            // Process checkout
            OrderResponse orderResponse = checkoutService.processCheckout(userId, checkoutRequest);
            
            System.out.println("🎉 CHECKOUT COMPLETED SUCCESSFULLY! Order ID: " + orderResponse.getOrderId());
            System.out.println("🛍️ Order items count: " + (orderResponse.getOrderItems() != null ? orderResponse.getOrderItems().size() : 0));
            
            // Return the response in the exact format expected by frontend
            Map<String, Object> response = Map.of(
                "success", true,
                "order", orderResponse,
                "message", "Order placed successfully"
            );
            
            System.out.println("📤 Sending response: " + response);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ CHECKOUT ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateCheckout(HttpServletRequest request) {
        try {
            System.out.println("🔍 Validating checkout...");
            Integer userId = extractUserIdFromRequest(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Authentication required"
                ));
            }
            
            Map<String, Object> validation = checkoutService.validateCheckout(userId);
            System.out.println("✅ Checkout validation result: " + validation);
            return ResponseEntity.ok(validation);
        } catch (Exception e) {
            System.out.println("❌ Checkout validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // Simple test endpoint to verify the endpoint is reachable
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        System.out.println("✅ /api/checkout/test endpoint reached successfully");
        return ResponseEntity.ok(Map.of(
            "message", "Checkout endpoint is working!",
            "success", true,
            "timestamp", System.currentTimeMillis()
        ));
    }

    private Integer extractUserIdFromRequest(HttpServletRequest request) {
        try {
            // Method 1: Get from request attribute (set by AuthenticationFilter)
            Object userIdAttr = request.getAttribute("userId");
            if (userIdAttr != null) {
                Integer userId = (Integer) userIdAttr;
                System.out.println("✅ User ID from request attribute: " + userId);
                return userId;
            }

            // Method 2: Extract from Authorization header using AuthService
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                System.out.println("🔐 Token found in Authorization header");
                
                if (authService.validateToken(token)) {
                    Integer userId = authService.getUserIdFromToken(token);
                    if (userId != null) {
                        System.out.println("✅ User ID from token: " + userId);
                        return userId;
                    }
                }
            }

            System.out.println("❌ Could not extract user ID from request");
            return null;
            
        } catch (Exception e) {
            System.out.println("❌ Error in user ID extraction: " + e.getMessage());
            return null;
        }
    }
}