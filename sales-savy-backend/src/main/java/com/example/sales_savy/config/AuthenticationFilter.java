package com.example.sales_savy.config;

import com.example.sales_savy.service.AuthService;
import com.example.sales_savy.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        System.out.println("🔐 Authentication Filter - Processing: " + method + " " + path);
        
        // Skip authentication for public endpoints
        if (isPublicEndpoint(request)) {
            System.out.println("✅ Public endpoint, skipping authentication: " + path);
            filterChain.doFilter(request, response);
            return;
        }
        
        // Try to extract token and authenticate user
        String token = extractTokenFromRequest(request);
        
        if (token == null) {
            System.out.println("❌ No token found for protected endpoint: " + path);
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentication token required", path);
            return;
        }
        
        try {
            System.out.println("🔐 Token found, validating...");
            if (!authService.validateToken(token)) {
                System.out.println("❌ Token validation failed for: " + path);
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token", path);
                return;
            }
            
            User user = authService.getUserFromToken(token);
            if (user == null) {
                System.out.println("❌ User not found for valid token: " + path);
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "User not found", path);
                return;
            }
            
            // ✅ Set user attributes for authorization
            request.setAttribute("authenticatedUser", user);
            request.setAttribute("userId", user.getUserId());
            request.setAttribute("userRole", user.getRole().name());
            
            System.out.println("✅ User authenticated: " + user.getUsername() + 
                             " (ID: " + user.getUserId() + 
                             ", Role: " + user.getRole() + ") for " + path);
            
            // ✅ Check admin endpoints authorization
            if (path.startsWith("/api/admin/") && !"ADMIN".equals(user.getRole().name())) {
                System.out.println("❌ Access denied: User " + user.getUsername() + 
                                 " with role " + user.getRole() + 
                                 " tried to access admin endpoint: " + path);
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN,
                    "Access denied - Admin role required", path);
                return;
            }
            
            // ✅ ALLOW request to continue to the controller
            System.out.println("✅ Allowing authenticated request to continue: " + path);
            filterChain.doFilter(request, response);
            
        } catch (Exception e) {
            System.out.println("❌ Token validation error: " + e.getMessage());
            e.printStackTrace();
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                "Token validation error: " + e.getMessage(), path);
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        // 1. Try Authorization header first
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("🔐 Token found in Authorization header: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token));
            return token;
        }
        
        // 2. Try cookies
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("authToken".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    System.out.println("🔐 Token found in cookie: " + (token.length() > 20 ? token.substring(0, 20) + "..." : token));
                    return token;
                }
            }
        }
        
        System.out.println("🔐 No token found in request");
        return null;
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // ✅ FIX: Added cart debug endpoint to public endpoints
        return path.startsWith("/api/auth/") ||
               (path.startsWith("/api/products") && "GET".equals(method)) ||
               path.startsWith("/api/public/") ||
               path.equals("/api/cart/debug") || // ✅ Added cart debug endpoint
               path.equals("/error") ||
               path.equals("/") ||
               "OPTIONS".equals(method); // Allow CORS preflight
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message, String path) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonResponse = String.format(
            "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\",\"path\":\"%s\"}",
            java.time.Instant.now().toString(),
            status,
            status == 401 ? "Unauthorized" : "Forbidden",
            message,
            path
        );
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
        System.out.println("❌ Sent error response: " + status + " - " + message);
    }
}