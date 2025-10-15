package com.example.sales_savy.service;

import com.example.sales_savy.model.User;
import com.example.sales_savy.model.JWTToken;
import com.example.sales_savy.model.VerificationToken;
import com.example.sales_savy.repository.UserRepository;
import com.example.sales_savy.repository.JWTTokenRepository;
import com.example.sales_savy.repository.VerificationTokenRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Autowired private UserRepository userRepository;
    @Autowired private JWTTokenRepository jwtTokenRepository;
    @Autowired private VerificationTokenRepository verificationTokenRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    // -------------------------
    // Authentication - FIXED VERSION
    // -------------------------
    public User authenticate(String username, String password) {
        System.out.println("🔐 AUTHENTICATE CALLED - Username/Email: " + username);
        
        // First try username
        Optional<User> userOptional = userRepository.findByUsername(username);
        System.out.println("🔍 User found by username '" + username + "': " + userOptional.isPresent());
        
        // If not found by username, try email
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(username);
            System.out.println("🔍 User found by email '" + username + "': " + userOptional.isPresent());
        }

        if (userOptional.isEmpty()) {
            System.out.println("❌ No user found with username/email: " + username);
            throw new RuntimeException("Invalid credentials - User not found");
        }

        User user = userOptional.get();
        System.out.println("👤 User found: " + user.getUsername() + " | Email: " + user.getEmail() + " | ID: " + user.getUserId());
        
        // Debug: Print stored password hash
        System.out.println("🔑 Stored password hash: " + user.getPassword());
        System.out.println("🔑 Provided password: " + password);
        
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("🔑 Password matches: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("❌ Password does not match for user: " + user.getUsername());
            throw new RuntimeException("Invalid credentials - Incorrect password");
        }

        if (!user.isEnabled()) {
            System.out.println("❌ User account is disabled: " + user.getUsername());
            throw new RuntimeException("Account is disabled");
        }

        System.out.println("✅ Authentication successful for user: " + user.getUsername());
        return user;
    }

    // -------------------------
    // JWT Token Generation
    // -------------------------
    public String generateToken(User user) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

            String token = Jwts.builder()
                    .setSubject(user.getUsername())
                    .claim("userId", user.getUserId())
                    .claim("role", user.getRole().name())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                    .signWith(key, SignatureAlgorithm.HS512)
                    .compact();

            JWTToken jwtToken = new JWTToken();
            jwtToken.setUser(user);
            jwtToken.setToken(token);
            jwtToken.setExpiresAt(LocalDateTime.now().plusHours(1));
            jwtTokenRepository.save(jwtToken);

            System.out.println("✅ Token generated for user: " + user.getUsername());
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token: " + e.getMessage());
        }
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            boolean isValid = !claims.getExpiration().before(new Date());
            System.out.println("🔐 Token validation - Valid: " + isValid);
            return isValid;

        } catch (Exception e) {
            System.out.println("❌ Token validation failed: " + e.getMessage());
            return false;
        }
    }

    public void logout(String token) {
        jwtTokenRepository.findByToken(token).ifPresent(jwtTokenRepository::delete);
        System.out.println("✅ Token invalidated for logout");
    }

    public User getUserFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Integer userId = claims.get("userId", Integer.class);
            if (userId != null) {
                return userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));
            }

            String username = claims.getSubject();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found for username: " + username));

        } catch (Exception e) {
            throw new RuntimeException("Invalid token: " + e.getMessage());
        }
    }

    public Integer getUserIdFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Integer userId = claims.get("userId", Integer.class);
            if (userId != null) return userId;

            String username = claims.getSubject();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found for username: " + username));
            return user.getUserId();

        } catch (Exception e) {
            return null;
        }
    }

    // -------------------------
    // Password Reset
    // -------------------------
    public String generatePasswordResetToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User with this email not found");
        }

        User user = userOptional.get();
        
        // Delete any existing verification tokens for this user first
        verificationTokenRepository.findByUser(user).ifPresent(verificationTokenRepository::delete);
        
        String resetToken = UUID.randomUUID().toString();

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(resetToken);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        
        verificationTokenRepository.save(verificationToken);

        System.out.println("✅ Password reset token generated for user: " + user.getEmail());
        return resetToken;
    }

    public void resetPassword(String token, String newPassword) {
        Optional<VerificationToken> verificationTokenOptional = verificationTokenRepository.findByToken(token);

        if (verificationTokenOptional.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        VerificationToken verificationToken = verificationTokenOptional.get();

        if (verificationToken.isExpired()) {
            verificationTokenRepository.delete(verificationToken);
            throw new RuntimeException("Reset token has expired");
        }

        User user = verificationToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);
        System.out.println("✅ Password reset successfully for user: " + user.getEmail());
    }

    public boolean validatePasswordResetToken(String token) {
        Optional<VerificationToken> verificationTokenOptional = verificationTokenRepository.findByToken(token);

        if (verificationTokenOptional.isEmpty()) return false;

        VerificationToken verificationToken = verificationTokenOptional.get();
        if (verificationToken.isExpired()) {
            verificationTokenRepository.delete(verificationToken);
            return false;
        }

        return true;
    }
}