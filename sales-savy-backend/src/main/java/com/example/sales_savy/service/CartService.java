package com.example.sales_savy.service;

import com.example.sales_savy.model.CartItem;
import com.example.sales_savy.model.User;
import com.example.sales_savy.model.Product;
import com.example.sales_savy.repository.CartItemRepository;
import com.example.sales_savy.repository.UserRepository;
import com.example.sales_savy.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class CartService {
    
    @Autowired 
    private CartItemRepository cartItemRepository;
    
    @Autowired 
    private UserRepository userRepository;
    
    @Autowired 
    private ProductRepository productRepository;

    public CartItem addToCart(Integer userId, Integer productId, Integer quantity) {
        System.out.println("🛒 Adding to cart - User: " + userId + ", Product: " + productId + ", Quantity: " + quantity);
        
        // Validate inputs
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        if (productId == null) {
            throw new RuntimeException("Product ID cannot be null");
        }
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be positive");
        }
        
        // Find user and product
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        System.out.println("✅ Found user: " + user.getUsername() + " and product: " + product.getName());

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);
        
        if (existingItem.isPresent()) {
            // Update quantity for existing item
            CartItem cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;
            cartItem.setQuantity(newQuantity);
            
            CartItem savedItem = cartItemRepository.save(cartItem);
            System.out.println("📦 Updated existing cart item. New quantity: " + newQuantity);
            return savedItem;
        } else {
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            
            CartItem savedItem = cartItemRepository.save(newItem);
            System.out.println("🆕 Created new cart item with ID: " + savedItem.getId());
            return savedItem;
        }
    }

    public List<CartItem> getCartItems(Integer userId) {
        System.out.println("🛒 Fetching cart items for user: " + userId);
        
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        System.out.println("✅ Found " + cartItems.size() + " cart items for user " + userId);
        
        // Initialize products to avoid LazyInitializationException
        for (CartItem item : cartItems) {
            if (item.getProduct() != null) {
                // Force initialization of product
                item.getProduct().getName();
                if (item.getProduct().getCategory() != null) {
                    item.getProduct().getCategory().getCategoryName();
                }
            }
        }
        
        return cartItems;
    }

    public void removeCartItem(Integer userId, Integer cartItemId) {
        System.out.println("🗑️ Removing cart item: " + cartItemId + " for user: " + userId);
        
        CartItem cartItem = cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found or doesn't belong to user"));
        
        cartItemRepository.delete(cartItem);
        System.out.println("✅ Cart item removed successfully");
    }

    public void updateCartItem(Integer userId, Integer cartItemId, Integer quantity) {
        System.out.println("✏️ Updating cart item: " + cartItemId + " for user: " + userId + " to quantity: " + quantity);
        
        if (quantity == null || quantity < 0) {
            throw new RuntimeException("Quantity must be non-negative");
        }
        
        CartItem cartItem = cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found or doesn't belong to user"));
        
        if (quantity == 0) {
            // Remove item if quantity is 0
            cartItemRepository.delete(cartItem);
            System.out.println("✅ Cart item removed (quantity set to 0)");
        } else {
            // Update quantity
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
            System.out.println("✅ Cart item updated to quantity: " + quantity);
        }
    }

    public void clearCart(Integer userId) {
        System.out.println("🧹 Clearing cart for user: " + userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        int itemsCount = cartItemRepository.countByUserId(userId);
        cartItemRepository.deleteByUser(user);
        
        System.out.println("✅ Cleared " + itemsCount + " items from cart");
    }

    public Integer getCartItemsCount(Integer userId) {
        Integer count = cartItemRepository.getTotalCartItemsCount(userId);
        System.out.println("📊 Cart items count for user " + userId + ": " + count);
        return count != null ? count : 0;
    }

    public Double getTotalCartValue(Integer userId) {
        Double total = cartItemRepository.getTotalCartValue(userId);
        System.out.println("💰 Cart total value for user " + userId + ": " + total);
        return total != null ? total : 0.0;
    }
    
    // Additional helper method
    public boolean isProductInCart(Integer userId, Integer productId) {
        Boolean exists = cartItemRepository.existsByUserIdAndProductId(userId, productId);
        System.out.println("🔍 Product " + productId + " in cart for user " + userId + ": " + exists);
        return exists != null ? exists : false;
    }
    
    // Helper method to create cart response DTO
    public Map<String, Object> createCartResponse(CartItem cartItem) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", cartItem.getId());
        response.put("quantity", cartItem.getQuantity());
        response.put("userId", cartItem.getUserId());
        
        if (cartItem.getProduct() != null) {
            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("productId", cartItem.getProduct().getProductId());
            productInfo.put("name", cartItem.getProduct().getName());
            productInfo.put("price", cartItem.getProduct().getPrice());
            productInfo.put("imageUrl", cartItem.getProduct().getImageUrl());
            response.put("product", productInfo);
        }
        
        return response;
    }
}