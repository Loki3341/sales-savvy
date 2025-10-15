package com.example.sales_savy.repository;

import com.example.sales_savy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // Use built-in count method
    @Override
    long count();
    
    // Count users by role
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = com.example.sales_savy.model.Role.ADMIN")
    long countAdmins();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = com.example.sales_savy.model.Role.CUSTOMER")
    long countCustomers();
}