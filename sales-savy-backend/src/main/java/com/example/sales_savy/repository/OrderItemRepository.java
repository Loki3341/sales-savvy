package com.example.sales_savy.repository;

import com.example.sales_savy.model.Order;
import com.example.sales_savy.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
    
    @Query("SELECT oi.product.productId, SUM(oi.quantity) as totalSold FROM OrderItem oi GROUP BY oi.product.productId ORDER BY totalSold DESC")
    List<Object[]> findPopularProducts();
    
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.product.productId = :productId")
    Integer getTotalQuantitySoldByProductId(@Param("productId") Integer productId);
}