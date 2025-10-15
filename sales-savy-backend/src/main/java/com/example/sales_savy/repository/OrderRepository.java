package com.example.sales_savy.repository;

import com.example.sales_savy.model.Order;
import com.example.sales_savy.model.OrderStatus;
import com.example.sales_savy.model.PaymentStatus;
import com.example.sales_savy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
    long countByUser(User user);
    boolean existsByOrderId(String orderId);
    List<Order> findByPaymentStatusOrderByCreatedAtDesc(PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status = :status")
    Double getTotalSalesByStatus(@Param("status") OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") OrderStatus status);
    
    // Use built-in count method
    @Override
    long count();
}