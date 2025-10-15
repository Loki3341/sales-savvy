package com.example.sales_savy.controller;

import com.example.sales_savy.model.User;
import com.example.sales_savy.model.Role;
import com.example.sales_savy.service.UserService;
import com.example.sales_savy.service.OrderService;
import com.example.sales_savy.service.AuthService;
import com.example.sales_savy.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminController {
    
    @Autowired 
    private UserService userService;
    
    @Autowired 
    private OrderService orderService;
    
    @Autowired 
    private AuthService authService;
    
    @Autowired
    private AdminService adminService;

    private User getAuthenticatedAdmin(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ No authorization header");
                return null;
            }
            
            String token = authHeader.substring(7);
            if (!authService.validateToken(token)) {
                System.out.println("❌ Invalid token");
                return null;
            }

            User user = authService.getUserFromToken(token);
            boolean isAdmin = user != null && user.getRole() == Role.ADMIN;
            System.out.println("🔐 Admin check - User: " + (user != null ? user.getUsername() : "null") + ", Is Admin: " + isAdmin);
            return isAdmin ? user : null;
        } catch (Exception e) {
            System.err.println("❌ Error in admin authentication: " + e.getMessage());
            return null;
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        System.out.println("👥 Admin users endpoint called");
        User admin = getAuthenticatedAdmin(request);
        if (admin == null) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied - Admin privileges required"));
        }

        List<User> users = adminService.getAllUsersForAdmin();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(HttpServletRequest request) {
        System.out.println("📊 Admin dashboard stats endpoint called");
        User admin = getAuthenticatedAdmin(request);
        if (admin == null) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied - Admin privileges required"));
        }

        try {
            Map<String, Object> stats = adminService.getAdminDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Error in admin dashboard stats: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/dashboard/popular-products")
    public ResponseEntity<?> getPopularProducts(HttpServletRequest request) {
        System.out.println("🔥 Admin popular products endpoint called");
        User admin = getAuthenticatedAdmin(request);
        if (admin == null) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        try {
            List<Map<String, Object>> popularProducts = orderService.getPopularProducts(10);
            return ResponseEntity.ok(popularProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Add test data endpoint for debugging
    @GetMapping("/test-data")
    public ResponseEntity<?> getTestData() {
        System.out.println("🧪 Test data endpoint called");
        Map<String, Object> testData = new HashMap<>();
        testData.put("success", true);
        testData.put("productCount", 150);
        testData.put("userCount", 89);
        testData.put("pendingOrders", 12);
        testData.put("revenue", 125000.50);
        testData.put("message", "Test data for dashboard");
        return ResponseEntity.ok(testData);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "admin");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}