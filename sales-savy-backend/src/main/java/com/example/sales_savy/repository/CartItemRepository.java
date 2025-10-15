package com.example.sales_savy.repository;

import com.example.sales_savy.model.CartItem;
import com.example.sales_savy.model.User;
import com.example.sales_savy.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    
    // ✅ Find cart items by user
    List<CartItem> findByUser(User user);
    
    // ✅ Find specific cart item by user and product
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    
    // ✅ Delete all cart items for a user
    @Transactional
    @Modifying
    void deleteByUser(User user);
    
    // ✅ Find cart items by user ID
    @Query("SELECT ci FROM CartItem ci WHERE ci.user.userId = :userId")
    List<CartItem> findByUserId(@Param("userId") Integer userId);
    
    // ✅ Get total quantity of items in cart
    @Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.user.userId = :userId")
    Integer getTotalCartItemsCount(@Param("userId") Integer userId);
    
    // ✅ Get total cart value
    @Query("SELECT COALESCE(SUM(ci.quantity * ci.product.price), 0.0) FROM CartItem ci WHERE ci.user.userId = :userId")
    Double getTotalCartValue(@Param("userId") Integer userId);
    
    // ✅ Find cart item by ID and user ID (security check)
    @Query("SELECT ci FROM CartItem ci WHERE ci.id = :cartItemId AND ci.user.userId = :userId")
    Optional<CartItem> findByIdAndUserId(@Param("cartItemId") Integer cartItemId, @Param("userId") Integer userId);
    
    // ✅ Count cart items for user
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.user.userId = :userId")
    Integer countByUserId(@Param("userId") Integer userId);
    
    // ✅ Check if product exists in user's cart
    @Query("SELECT CASE WHEN COUNT(ci) > 0 THEN true ELSE false END FROM CartItem ci WHERE ci.user.userId = :userId AND ci.product.productId = :productId")
    Boolean existsByUserIdAndProductId(@Param("userId") Integer userId, @Param("productId") Integer productId);
}