package com.example.sales_savy.service;

import com.example.sales_savy.model.*;
import com.example.sales_savy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    public Order createOrder(Integer userId, String shippingAddress, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        String orderId = "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = new Order();
        order.setOrderId(orderId);
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItemRepository.save(orderItem);

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        cartItemRepository.deleteByUser(user);
        return savedOrder;
    }

    public List<Order> getUserOrders(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(String orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order updatePaymentStatus(String orderId, PaymentStatus paymentStatus) {
        Order order = getOrderById(orderId);
        order.setPaymentStatus(paymentStatus);
        return orderRepository.save(order);
    }

    public List<OrderItem> getOrderItems(String orderId) {
        Order order = getOrderById(orderId);
        return orderItemRepository.findByOrder(order);
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }

    public Double getTotalRevenue() {
        Double revenue = orderRepository.getTotalSalesByStatus(OrderStatus.DELIVERED);
        return revenue != null ? revenue : 0.0;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalRevenue", getTotalRevenue());
        
        for (OrderStatus status : OrderStatus.values()) {
            Long count = orderRepository.countByStatus(status);
            stats.put(status.name().toLowerCase() + "Orders", count != null ? count : 0);
        }
        
        return stats;
    }

    public List<Map<String, Object>> getPopularProducts(int limit) {
        try {
            List<Object[]> popularProducts = orderItemRepository.findPopularProducts();
            return popularProducts.stream().limit(limit).map(result -> {
                Map<String, Object> productStats = new HashMap<>();
                productStats.put("productId", result[0]);
                productStats.put("totalSold", result[1]);
                return productStats;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}