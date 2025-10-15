package com.example.sales_savy.controller;

import com.example.sales_savy.model.User;
import com.example.sales_savy.model.Role;
import com.example.sales_savy.service.AuthService;
import com.example.sales_savy.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DashboardController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuthService authService;

    private boolean isAdmin(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ No valid authorization header");
                return false;
            }
            
            String token = authHeader.substring(7);
            if (!authService.validateToken(token)) {
                System.out.println("❌ Invalid token");
                return false;
            }

            User user = authService.getUserFromToken(token);
            boolean isAdmin = user != null && user.getRole() == Role.ADMIN;
            System.out.println("🔐 User role check - Is Admin: " + isAdmin);
            return isAdmin;
        } catch (Exception e) {
            System.err.println("❌ Error checking admin status: " + e.getMessage());
            return false;
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(HttpServletRequest request) {
        try {
            System.out.println("📊 Dashboard stats endpoint called");
            
            // Check if user is admin
            if (!isAdmin(request)) {
                System.out.println("❌ Access denied - User is not admin");
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", "Access denied. Admin privileges required."
                ));
            }

            System.out.println("✅ User is admin, generating dashboard statistics...");

            // Get all statistics from AdminService
            Map<String, Object> stats = adminService.getAdminDashboardStats();
            
            System.out.println("✅ Dashboard stats generated successfully");
            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            System.err.println("❌ Error generating dashboard stats: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Failed to generate dashboard statistics: " + e.getMessage()
            ));
        }
    }

    // Add test data endpoint
    @GetMapping("/test-data")
    public ResponseEntity<?> getTestData() {
        System.out.println("🧪 Dashboard test data endpoint called");
        Map<String, Object> testData = new HashMap<>();
        testData.put("success", true);
        testData.put("productCount", 45);
        testData.put("userCount", 23);
        testData.put("pendingOrders", 5);
        testData.put("revenue", 45000.75);
        testData.put("message", "Test data from dashboard endpoint");
        return ResponseEntity.ok(testData);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "dashboard");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}