package com.example.sales_savy.model;

public enum PaymentMethod {
    COD("Cash on Delivery"),
    CARD("Credit/Debit Card"),
    UPI("UPI Payment"),
    WALLET("Digital Wallet");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}