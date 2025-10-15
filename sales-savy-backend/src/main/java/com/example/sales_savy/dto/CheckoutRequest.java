package com.example.sales_savy.dto;

import com.example.sales_savy.model.PaymentMethod;
import java.util.Map;

public class CheckoutRequest {
    private String shippingAddress;
    private PaymentMethod paymentMethod;
    private Map<String, Object> paymentDetails; // ✅ ADDED: To match frontend structure
    
    // Additional fields for specific payment methods (optional - can be removed if using paymentDetails)
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String nameOnCard;
    private String upiId;
    private String walletType;
    private String mobileNumber;
    
    // Constructors
    public CheckoutRequest() {}
    
    public CheckoutRequest(String shippingAddress, PaymentMethod paymentMethod, Map<String, Object> paymentDetails) {
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.paymentDetails = paymentDetails;
    }
    
    // Getters and Setters
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public Map<String, Object> getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(Map<String, Object> paymentDetails) { this.paymentDetails = paymentDetails; }
    
    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    
    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }
    
    public String getNameOnCard() { return nameOnCard; }
    public void setNameOnCard(String nameOnCard) { this.nameOnCard = nameOnCard; }
    
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    
    public String getWalletType() { return walletType; }
    public void setWalletType(String walletType) { this.walletType = walletType; }
    
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    @Override
    public String toString() {
        return "CheckoutRequest{" +
                "shippingAddress='" + shippingAddress + '\'' +
                ", paymentMethod=" + paymentMethod +
                ", paymentDetails=" + paymentDetails +
                ", cardNumber='" + (cardNumber != null ? "***" + cardNumber.substring(Math.max(0, cardNumber.length() - 4)) : "null") + '\'' +
                ", expiryDate='" + expiryDate + '\'' +
                ", cvv='" + (cvv != null ? "***" : "null") + '\'' +
                ", nameOnCard='" + nameOnCard + '\'' +
                ", upiId='" + upiId + '\'' +
                ", walletType='" + walletType + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                '}';
    }
}