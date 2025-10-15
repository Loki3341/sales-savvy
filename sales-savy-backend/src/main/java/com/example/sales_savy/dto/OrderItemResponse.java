package com.example.sales_savy.dto;

import java.math.BigDecimal;
import java.util.Map;

public class OrderItemResponse {
    private Long id;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
    private String productImageUrl; // FIX: This field was missing
    private Map<String, Object> product; // FIX: Added for complete product info

    // Constructors
    public OrderItemResponse() {}

    public OrderItemResponse(Long id, String productName, BigDecimal price, 
                           Integer quantity, BigDecimal subtotal, String productImageUrl) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.productImageUrl = productImageUrl; // FIX: Initialize in constructor
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    // FIX: Added getter and setter for productImageUrl
    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { 
        this.productImageUrl = productImageUrl; 
    }

    // FIX: Added getter and setter for product
    public Map<String, Object> getProduct() { return product; }
    public void setProduct(Map<String, Object> product) { this.product = product; }

    @Override
    public String toString() {
        return "OrderItemResponse{" +
                "id=" + id +
                ", productName='" + productName + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", subtotal=" + subtotal +
                ", productImageUrl='" + productImageUrl + '\'' +
                ", product=" + product +
                '}';
    }
}