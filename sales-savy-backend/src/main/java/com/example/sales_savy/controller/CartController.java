package com.example.sales_savy.controller;

import com.example.sales_savy.model.CartItem;
import com.example.sales_savy.model.User;
import com.example.sales_savy.service.AuthService;
import com.example.sales_savy.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class CartController {
    @Autowired private CartService cartService;
    @Autowired private AuthService authService;

    // ✅ ADD DEBUG ENDPOINT
    @GetMapping("/debug")
    public ResponseEntity<?> debugAuth(HttpServletRequest request) {
        System.out.println("🔍 DEBUG AUTH ENDPOINT CALLED");
        
        // Check all possible ways to get user info
        Integer userIdFromAttr = (Integer) request.getAttribute("userId");
        User userFromAttr = (User) request.getAttribute("authenticatedUser");
        String userRoleFromAttr = (String) request.getAttribute("userRole");
        
        String authHeader = request.getHeader("Authorization");
        
        System.out.println("🔍 DEBUG INFO:");
        System.out.println("  - userId from attribute: " + userIdFromAttr);
        System.out.println("  - user from attribute: " + (userFromAttr != null ? userFromAttr.getUsername() : "null"));
        System.out.println("  - userRole from attribute: " + userRoleFromAttr);
        System.out.println("  - Authorization header: " + authHeader);
        
        if (userIdFromAttr != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User is authenticated",
                "userId", userIdFromAttr,
                "username", userFromAttr != null ? userFromAttr.getUsername() : "unknown"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "User not authenticated",
                "debug", Map.of(
                    "userIdAttr", userIdFromAttr,
                    "userAttr", userFromAttr != null ? userFromAttr.getUsername() : "null",
                    "authHeader", authHeader
                )
            ));
        }
    }

    // Get cart for current user
    @GetMapping
    public ResponseEntity<?> getCartItems(HttpServletRequest request) {
        try {
            Integer userId = extractUserIdFromRequest(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }
            
            List<CartItem> cartItems = cartService.getCartItems(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cartItems", cartItems);
            response.put("totalItems", cartItems.size());
            response.put("message", "Cart items fetched successfully");
            
            System.out.println("✅ Cart items fetched successfully for user " + userId + ", items: " + cartItems.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error fetching cart items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse("Failed to fetch cart items: " + e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request, 
                                      HttpServletRequest httpRequest) {
        try {
            Integer userId = extractUserIdFromRequest(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }
            
            Object productIdObj = request.get("productId");
            Object quantityObj = request.get("quantity");
            
            // Handle different data types
            Integer productId = null;
            Integer quantity = quantityObj != null ? Integer.valueOf(quantityObj.toString()) : 1;
            
            if (productIdObj != null) {
                if (productIdObj instanceof Number) {
                    productId = ((Number) productIdObj).intValue();
                } else {
                    productId = Integer.valueOf(productIdObj.toString());
                }
            }
            
            if (productId == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Product ID is required"));
            }
            
            if (quantity <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Quantity must be positive"));
            }
            
            System.out.println("🛒 Adding to cart - User: " + userId + ", Product: " + productId + ", Quantity: " + quantity);
            CartItem cartItem = cartService.addToCart(userId, productId, quantity);
            
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("cartItem", cartItem);
            successResponse.put("message", "Item added to cart successfully");
            
            System.out.println("✅ Item added to cart successfully");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            System.err.println("❌ Error adding to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestBody Map<String, Object> request, 
                                           HttpServletRequest httpRequest) {
        try {
            Integer userId = extractUserIdFromRequest(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }
            
            Object cartItemIdObj = request.get("cartItemId");
            Object quantityObj = request.get("quantity");
            
            Integer cartItemId = null;
            Integer quantity = quantityObj != null ? Integer.valueOf(quantityObj.toString()) : 1;
            
            if (cartItemIdObj != null) {
                if (cartItemIdObj instanceof Number) {
                    cartItemId = ((Number) cartItemIdObj).intValue();
                } else {
                    cartItemId = Integer.valueOf(cartItemIdObj.toString());
                }
            }
            
            if (cartItemId == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Cart item ID is required"));
            }
            
            cartService.updateCartItem(userId, cartItemId, quantity);
            return ResponseEntity.ok(createSuccessResponse("Cart item updated successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error updating cart item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Integer cartItemId, 
                                           HttpServletRequest httpRequest) {
        try {
            Integer userId = extractUserIdFromRequest(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }
            
            cartService.removeCartItem(userId, cartItemId);
            return ResponseEntity.ok(createSuccessResponse("Item removed from cart"));
        } catch (Exception e) {
            System.err.println("❌ Error removing from cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(HttpServletRequest httpRequest) {
        try {
            Integer userId = extractUserIdFromRequest(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }
            
            cartService.clearCart(userId);
            return ResponseEntity.ok(createSuccessResponse("Cart cleared successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error clearing cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getCartSummary(HttpServletRequest httpRequest) {
        try {
            Integer userId = extractUserIdFromRequest(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(401).body(createErrorResponse("Authentication required"));
            }
            
            List<CartItem> cartItems = cartService.getCartItems(userId);
            Integer itemCount = cartService.getCartItemsCount(userId);
            Double totalValue = cartService.getTotalCartValue(userId);
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("success", true);
            summary.put("cartItems", cartItems);
            summary.put("totalItems", itemCount);
            summary.put("totalValue", totalValue);
            summary.put("total", totalValue);
            summary.put("message", "Cart summary fetched successfully");
            
            System.out.println("✅ Cart summary fetched for user " + userId + ": " + itemCount + " items, total: " + totalValue);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("❌ Error fetching cart summary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse("Failed to fetch cart summary: " + e.getMessage()));
        }
    }

    // ✅ SIMPLIFIED: Extract userId from request
    private Integer extractUserIdFromRequest(HttpServletRequest request) {
        try {
            System.out.println("🔐 Attempting to extract user ID from request...");
            
            // 1. First try the attributes set by AuthenticationFilter
            Object userIdAttr = request.getAttribute("userId");
            if (userIdAttr instanceof Integer) {
                System.out.println("✅ User ID extracted from attribute: " + userIdAttr);
                return (Integer) userIdAttr;
            }
            
            // 2. Try authenticated user object
            Object authenticatedUser = request.getAttribute("authenticatedUser");
            if (authenticatedUser instanceof User) {
                User user = (User) authenticatedUser;
                System.out.println("✅ User ID extracted from authenticated user: " + user.getUserId());
                return user.getUserId();
            }
            
            // 3. Fallback: Extract from Authorization header directly
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                System.out.println("🔐 Extracting userId from Authorization header directly");
                Integer userId = authService.getUserIdFromToken(token);
                if (userId != null) {
                    System.out.println("✅ User ID extracted directly from token: " + userId);
                    return userId;
                }
            }
            
            System.out.println("❌ No authentication found in request");
            System.out.println("🔍 Available attributes:");
            var attributeNames = request.getAttributeNames();
            while (attributeNames.hasMoreElements()) {
                String name = attributeNames.nextElement();
                System.out.println("  - " + name + ": " + request.getAttribute(name));
            }
            
            return null;
            
        } catch (Exception e) {
            System.err.println("❌ Error extracting userId from request: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return response;
    }
    
    private Map<String, Object> createErrorResponse(String error) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", error);
        return response;
    }
}