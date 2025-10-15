package com.example.sales_savy.controller;

import com.example.sales_savy.dto.CreateOrderRequest;
import com.example.sales_savy.dto.OrderResponse;
import com.example.sales_savy.dto.OrderItemResponse;
import com.example.sales_savy.model.*;
import com.example.sales_savy.service.OrderService;
import com.example.sales_savy.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5174")
public class OrderController {
    
    @Autowired 
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    // Get orders for current authenticated user
    @GetMapping("/user/current")
    public ResponseEntity<?> getCurrentUserOrders(HttpServletRequest request) {
        try {
            System.out.println("📦 Getting orders for current user...");
            
            Integer userId = extractUserIdFromRequest(request);
            
            if (userId == null) {
                System.out.println("❌ User not authenticated");
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Authentication required"
                ));
            }
            
            System.out.println("✅ Getting orders for user ID: " + userId);
            List<Order> orders = orderService.getUserOrders(userId);
            System.out.println("📦 Found " + orders.size() + " orders for user " + userId);
            
            // Convert to OrderResponse DTOs
            List<OrderResponse> orderResponses = orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(orderResponses);
            
        } catch (Exception e) {
            System.out.println("❌ Error getting user orders: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable String orderId, HttpServletRequest request) {
        try {
            System.out.println("📋 Getting order details for: " + orderId);
            
            Integer userId = extractUserIdFromRequest(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            Order order = orderService.getOrderById(orderId);
            
            // Verify the order belongs to the current user
            if (!order.getUser().getUserId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
            
            OrderResponse orderResponse = convertToOrderResponse(order);
            System.out.println("✅ Order details retrieved successfully");
            
            return ResponseEntity.ok(orderResponse);
            
        } catch (Exception e) {
            System.out.println("❌ Error getting order details: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createOrder(@PathVariable Integer userId, @RequestBody CreateOrderRequest request) {
        try {
            Order order = orderService.createOrder(userId, request.getShippingAddress(), request.getPaymentMethod());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderItems(orderId));
    }

    // Cancel order endpoint
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId, HttpServletRequest request) {
        try {
            Integer userId = extractUserIdFromRequest(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            Order order = orderService.getOrderById(orderId);
            
            // Verify the order belongs to the current user
            if (!order.getUser().getUserId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
            
            // Only allow cancellation of pending or confirmed orders
            if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order cannot be cancelled at this stage"));
            }
            
            Order cancelledOrder = orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
            OrderResponse orderResponse = convertToOrderResponse(cancelledOrder);
            return ResponseEntity.ok(orderResponse);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Helper method to convert Order to OrderResponse - FIXED IMAGE URL MAPPING
    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderItemResponse> orderItemResponses = order.getOrderItems().stream()
            .map(orderItem -> {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setId(orderItem.getId());
                itemResponse.setProductName(orderItem.getProduct().getName());
                itemResponse.setPrice(orderItem.getPrice());
                itemResponse.setQuantity(orderItem.getQuantity());
                itemResponse.setSubtotal(orderItem.getSubtotal());
                
                // FIX: Properly set product image URL
                String imageUrl = orderItem.getProduct().getImageUrl();
                System.out.println("🖼️ Setting product image URL for " + orderItem.getProduct().getName() + ": " + imageUrl);
                itemResponse.setProductImageUrl(imageUrl);
                
                // FIX: Also include complete product info for frontend
                Map<String, Object> productInfo = new HashMap<>();
                productInfo.put("id", orderItem.getProduct().getProductId());
                productInfo.put("name", orderItem.getProduct().getName());
                productInfo.put("description", orderItem.getProduct().getDescription());
                productInfo.put("price", orderItem.getProduct().getPrice());
                productInfo.put("imageUrl", imageUrl);
                productInfo.put("image", imageUrl); // Add both formats for compatibility
                itemResponse.setProduct(productInfo);
                
                return itemResponse;
            })
            .collect(Collectors.toList());

        return new OrderResponse(
            order.getOrderId(),
            order.getTotalAmount(),
            order.getStatus(),
            order.getPaymentStatus(),
            order.getPaymentMethod(),
            order.getShippingAddress(),
            order.getCreatedAt(),
            orderItemResponses
        );
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