package com.example.sales_savy.controller;

import com.example.sales_savy.dto.LoginRequest;
import com.example.sales_savy.model.User;
import com.example.sales_savy.service.AuthService;
import com.example.sales_savy.service.UserService;
import com.example.sales_savy.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    // Debug endpoint to check all available endpoints
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debug() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "active");
        response.put("service", "Auth Service");
        response.put("timestamp", System.currentTimeMillis());
        response.put("availableEndpoints", new String[]{
            "GET /api/auth/debug",
            "GET /api/auth/health",
            "GET /api/auth/test",
            "GET /api/auth/me",
            "GET /api/auth/validate",
            "GET /api/auth/validate-reset-token",
            "POST /api/auth/register",
            "POST /api/auth/login",
            "POST /api/auth/logout",
            "POST /api/auth/forgot-password",
            "POST /api/auth/reset-password"
        });
        return ResponseEntity.ok(response);
    }

    // Public health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("message", "Auth service is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("service", "sales-savy-auth");
        return ResponseEntity.ok(response);
    }

    // Public test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Test endpoint works!");
        response.put("backend", "Spring Boot");
        response.put("status", "OK");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        try {
            String token = extractTokenFromHeader(tokenHeader);
            if (token == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Authentication required",
                    "success", false
                ));
            }
            
            User user = authService.getUserFromToken(token);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "user", user,
                "message", "Current user fetched successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to get current user: " + e.getMessage(),
                "success", false
            ));
        }
    }

    /**
     * Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user, HttpServletResponse response) {
        try {
            System.out.println("🎯 REGISTER ENDPOINT CALLED");
            User registeredUser = userService.registerUser(user);
            String token = authService.generateToken(registeredUser);

            // Set token in cookie
            setAuthCookie(response, token);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "User registered successfully");
            responseBody.put("user", registeredUser);
            responseBody.put("token", token);
            responseBody.put("role", registeredUser.getRole());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Registration failed: " + e.getMessage()
            ));
        }
    }

    /**
     * Authenticate user
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            System.out.println("🎯 LOGIN ENDPOINT CALLED");
            User user = authService.authenticate(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );
            String token = authService.generateToken(user);

            // Set token in cookie
            setAuthCookie(response, token);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "Login successful");
            responseBody.put("user", user);
            responseBody.put("token", token);
            responseBody.put("role", user.getRole());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Login failed: " + e.getMessage()
            ));
        }
    }

    /**
     * Logout user
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                   HttpServletResponse response) {
        try {
            System.out.println("🎯 LOGOUT ENDPOINT CALLED");
            String token = extractTokenFromHeader(tokenHeader);
            
            if (token != null) {
                authService.logout(token);
            }
            
            // Clear the cookie
            clearAuthCookie(response);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logout successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Logout failed: " + e.getMessage()
            ));
        }
    }

    /**
     * Validate token endpoint
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        try {
            String token = extractTokenFromHeader(tokenHeader);
            
            if (token == null) {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "valid", false, 
                    "message", "No token provided"
                ));
            }
            
            boolean isValid = authService.validateToken(token);
            if (isValid) {
                User user = authService.getUserFromToken(token);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "valid", true,
                    "user", user,
                    "message", "Token is valid"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "valid", false, 
                    "message", "Invalid token"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "valid", false, 
                "message", "Token validation failed: " + e.getMessage()
            ));
        }
    }

    /**
     * Forgot password - Send reset email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            System.out.println("🎯 FORGOT PASSWORD ENDPOINT CALLED");
            String email = request.get("email");
            System.out.println("🔐 Forgot password request received for email: " + email);
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Email is required"
                ));
            }

            // Generate reset token and send email
            String resetToken = authService.generatePasswordResetToken(email);
            
            // Send reset email
            emailService.sendPasswordResetEmail(email, resetToken);

            System.out.println("✅ Password reset email sent successfully to: " + email);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset email sent successfully"
            ));
        } catch (Exception e) {
            System.out.println("❌ Forgot password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Reset password with token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            System.out.println("🎯 RESET PASSWORD ENDPOINT CALLED");
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            System.out.println("🔐 Reset password request received");
            
            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Token and new password are required"
                ));
            }

            // Reset password
            authService.resetPassword(token, newPassword);

            System.out.println("✅ Password reset successfully");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset successfully"
            ));
        } catch (Exception e) {
            System.out.println("❌ Reset password error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Validate reset token
     */
    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            System.out.println("🎯 VALIDATE RESET TOKEN ENDPOINT CALLED");
            System.out.println("🔐 Validating reset token: " + token);
            boolean isValid = authService.validatePasswordResetToken(token);
            
            System.out.println("✅ Reset token validation result: " + isValid);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "valid", isValid,
                "message", isValid ? "Token is valid" : "Token is invalid or expired"
            ));
        } catch (Exception e) {
            System.out.println("❌ Reset token validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "valid", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Extract token from Authorization header
     */
    private String extractTokenFromHeader(String tokenHeader) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            return tokenHeader.substring(7);
        }
        return null;
    }

    /**
     * Set auth token in cookie
     */
    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("authToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(3600); // 1 hour
        response.addCookie(cookie);
    }

    /**
     * Clear auth cookie
     */
    private void clearAuthCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("authToken", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}