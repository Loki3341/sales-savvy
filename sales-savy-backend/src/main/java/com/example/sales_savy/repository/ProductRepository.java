package com.example.sales_savy.repository;

import com.example.sales_savy.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoryCategoryId(Integer categoryId);
    List<Product> findByCategoryCategoryName(String categoryName);
    
    // Fixed count method - use the built-in count() method
    @Override
    long count();
    
    // Check if products exist
    default boolean existsAnyProduct() {
        return count() > 0;
    }
}