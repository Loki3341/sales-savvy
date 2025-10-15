package com.example.sales_savy.dto;

public class PaymentResponse {
    private String razorpayOrderId;
    private String amount;
    private String currency;
    private String key;

    public PaymentResponse() {}
    
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
}