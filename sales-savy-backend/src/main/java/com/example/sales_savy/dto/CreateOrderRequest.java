package com.example.sales_savy.dto;

import com.example.sales_savy.model.PaymentMethod;

public class CreateOrderRequest {
    private String shippingAddress;
    private PaymentMethod paymentMethod;

    public CreateOrderRequest() {}
    
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
}