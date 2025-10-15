package com.example.sales_savy.service;

import com.example.sales_savy.dto.CheckoutRequest;
import com.example.sales_savy.dto.OrderResponse;
import com.example.sales_savy.dto.OrderItemResponse;
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
public class CheckoutService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    public OrderResponse processCheckout(Integer userId, CheckoutRequest checkoutRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total and validate stock
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        // Generate order ID
        String orderId = "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create order
        Order order = new Order();
        order.setOrderId(orderId);
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(checkoutRequest.getShippingAddress());
        order.setPaymentMethod(checkoutRequest.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);
        
        // Set payment status based on payment method
        if (checkoutRequest.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }
        
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // Create order items and update stock
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            
            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);

            // Update product stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Set the order items to the order object
        savedOrder.setOrderItems(orderItems);

        // Clear cart
        cartItemRepository.deleteByUser(user);
        
        // Convert to OrderResponse to avoid JSON serialization issues
        return convertToOrderResponse(savedOrder);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setShippingAddress(order.getShippingAddress());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setCreatedAt(order.getCreatedAt());
        
        // Convert order items
        if (order.getOrderItems() != null) {
            List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::convertToOrderItemResponse)
                .collect(Collectors.toList());
            response.setOrderItems(itemResponses);
        }
        
        return response;
    }

    private OrderItemResponse convertToOrderItemResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(orderItem.getId());
        response.setProductName(orderItem.getProduct().getName());
        response.setPrice(orderItem.getPrice());
        response.setQuantity(orderItem.getQuantity());
        response.setSubtotal(orderItem.getSubtotal());
        return response;
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
    }

    public Map<String, Object> validateCheckout(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        Map<String, Object> validation = new HashMap<>();
        
        if (cartItems.isEmpty()) {
            validation.put("valid", false);
            validation.put("error", "Cart is empty");
            return validation;
        }

        // Check stock availability
        List<String> outOfStockItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                outOfStockItems.add(product.getName() + " (available: " + product.getStock() + ", requested: " + cartItem.getQuantity() + ")");
            }
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        if (!outOfStockItems.isEmpty()) {
            validation.put("valid", false);
            validation.put("error", "Insufficient stock for: " + String.join(", ", outOfStockItems));
            return validation;
        }

        validation.put("valid", true);
        validation.put("totalAmount", totalAmount);
        validation.put("itemCount", cartItems.size());
        return validation;
    }
}