package com.example.sales_savy.controller;

import com.example.sales_savy.model.Product;
import com.example.sales_savy.model.Category;
import com.example.sales_savy.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Get all products with category information
     */
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            System.out.println("📦 Returning " + products.size() + " products");
            
            // Log categories for debugging
            products.forEach(product -> {
                if (product.getCategory() != null) {
                    System.out.println("🎯 Product: " + product.getName() + 
                                     " | Category: " + product.getCategory().getCategoryName() +
                                     " | Category ID: " + product.getCategory().getCategoryId());
                } else {
                    System.out.println("⚠️ Product: " + product.getName() + " | No category assigned");
                }
            });
            
            if (products.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "No products found");
                response.put("products", products);
                return ResponseEntity.ok(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", products);
            response.put("count", products.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error in getAllProducts: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch products");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get products by category
     */
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable String categoryName) {
        try {
            System.out.println("🎯 Fetching products for category: " + categoryName);
            List<Product> products = productService.getAllProducts();
            
            // Filter products by category name
            List<Product> filteredProducts = products.stream()
                .filter(product -> {
                    if (product.getCategory() == null) return false;
                    String productCategory = product.getCategory().getCategoryName();
                    return productCategory != null && 
                           productCategory.equalsIgnoreCase(categoryName);
                })
                .toList();
            
            System.out.println("✅ Found " + filteredProducts.size() + " products in category: " + categoryName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", filteredProducts);
            response.put("count", filteredProducts.size());
            response.put("category", categoryName);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error fetching products by category: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch products for category: " + categoryName);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        try {
            return productService.getProductById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Product not found");
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all categories
     */
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = productService.getAllCategories();
            
            Map<String, Object> response = new HashMap<>();
            response.put("categories", categories);
            response.put("count", categories.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch categories");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Create new product
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product created = productService.createProduct(product);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create product: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Create new category
     */
    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            Category created = productService.createCategory(category);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create category: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "products");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}