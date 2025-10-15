package com.example.sales_savy.service;

import com.example.sales_savy.model.User;
import com.example.sales_savy.model.OrderStatus;
import com.example.sales_savy.repository.UserRepository;
import com.example.sales_savy.repository.OrderRepository;
import com.example.sales_savy.repository.ProductRepository;
import com.example.sales_savy.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            System.out.println("🔄 Calculating admin dashboard statistics from database...");

            // Total products - direct database count
            long totalProducts = productRepository.count();
            stats.put("totalProducts", totalProducts);
            stats.put("products", totalProducts);
            System.out.println("📦 Total Products from DB: " + totalProducts);

            // Total users - direct database count
            long totalUsers = userRepository.count();
            stats.put("totalUsers", totalUsers);
            stats.put("users", totalUsers);
            System.out.println("👥 Total Users from DB: " + totalUsers);

            // Total orders - direct database count
            long totalOrders = orderRepository.count();
            stats.put("totalOrders", totalOrders);
            System.out.println("📋 Total Orders from DB: " + totalOrders);

            // Total revenue (from delivered orders)
            Double totalRevenue = orderRepository.getTotalSalesByStatus(OrderStatus.DELIVERED);
            double revenue = totalRevenue != null ? totalRevenue : 0.0;
            stats.put("totalRevenue", revenue);
            stats.put("revenue", revenue);
            System.out.println("💰 Total Revenue from DB: " + revenue);

            // Pending orders count
            Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
            long pendingCount = pendingOrders != null ? pendingOrders : 0L;
            stats.put("pendingOrders", pendingCount);
            stats.put("pending", pendingCount);
            System.out.println("⏳ Pending Orders from DB: " + pendingCount);

            // Additional stats for debugging
            long adminCount = userRepository.countAdmins();
            long customerCount = userRepository.countCustomers();
            System.out.println("👑 Admins: " + adminCount + ", 👥 Customers: " + customerCount);

            // Add success flag
            stats.put("success", true);
            stats.put("message", "Real database statistics retrieved successfully");
            stats.put("source", "database");

            System.out.println("✅ Final Real Database Stats: " + stats);

        } catch (Exception e) {
            System.err.println("❌ Error calculating admin dashboard stats from database: " + e.getMessage());
            e.printStackTrace();
            
            // Return error with zeros but indicate it's from database failure
            stats.put("totalProducts", 0L);
            stats.put("products", 0L);
            stats.put("totalUsers", 0L);
            stats.put("users", 0L);
            stats.put("totalOrders", 0L);
            stats.put("totalRevenue", 0.0);
            stats.put("revenue", 0.0);
            stats.put("pendingOrders", 0L);
            stats.put("pending", 0L);
            stats.put("success", false);
            stats.put("error", e.getMessage());
            stats.put("source", "database-error");
        }

        return stats;
    }

    public List<User> getAllUsersForAdmin() {
        try {
            List<User> users = userRepository.findAll();
            // Clear passwords for security
            users.forEach(user -> user.setPassword(null));
            System.out.println("✅ Retrieved " + users.size() + " real users from database for admin");
            return users;
        } catch (Exception e) {
            System.err.println("❌ Error fetching users from database: " + e.getMessage());
            return List.of();
        }
    }
}