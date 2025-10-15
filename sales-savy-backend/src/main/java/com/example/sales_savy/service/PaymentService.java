package com.example.sales_savy.service;

import com.example.sales_savy.dto.PaymentRequest;
import com.example.sales_savy.dto.PaymentResponse;
import com.example.sales_savy.model.Order;
import com.example.sales_savy.model.PaymentStatus;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Value("${razorpay.key.id:test_key}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:test_secret}")
    private String razorpayKeySecret;

    private RazorpayClient razorpayClient;

    private final OrderService orderService;

    @Autowired
    public PaymentService(OrderService orderService) {
        this.orderService = orderService;
        try {
            // Initialize Razorpay client with error handling
            if (razorpayKeyId != null && !razorpayKeyId.equals("test_key") && 
                razorpayKeySecret != null && !razorpayKeySecret.equals("test_secret")) {
                this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            } else {
                // Use dummy client for development
                System.out.println("Razorpay credentials not configured. Using dummy payment service.");
            }
        } catch (Exception e) {
            System.out.println("Razorpay client initialization failed: " + e.getMessage());
            // Continue without Razorpay for development
        }
    }

    public PaymentResponse createPayment(PaymentRequest paymentRequest) throws RazorpayException {
        // If Razorpay client is not initialized, create a dummy response
        if (razorpayClient == null) {
            return createDummyPaymentResponse(paymentRequest);
        }

        try {
            JSONObject options = new JSONObject();
            options.put("amount", paymentRequest.getAmount() * 100); // Convert to paise
            options.put("currency", paymentRequest.getCurrency());
            options.put("receipt", paymentRequest.getOrderId());
            
            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
            
            PaymentResponse paymentResponse = new PaymentResponse();
            paymentResponse.setRazorpayOrderId(razorpayOrder.get("id"));
            paymentResponse.setAmount(String.valueOf(paymentRequest.getAmount()));
            paymentResponse.setCurrency(paymentRequest.getCurrency());
            paymentResponse.setKey(razorpayKeyId);
            
            return paymentResponse;
        } catch (RazorpayException e) {
            throw new RazorpayException("Failed to create payment: " + e.getMessage());
        }
    }

    private PaymentResponse createDummyPaymentResponse(PaymentRequest paymentRequest) {
        PaymentResponse response = new PaymentResponse();
        response.setRazorpayOrderId("dummy_order_" + System.currentTimeMillis());
        response.setAmount(String.valueOf(paymentRequest.getAmount()));
        response.setCurrency(paymentRequest.getCurrency());
        response.setKey("dummy_key");
        return response;
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        try {
            // For development, always return true
            // In production, implement proper Razorpay signature verification
            orderService.updatePaymentStatus(orderId, PaymentStatus.COMPLETED);
            return true;
        } catch (Exception e) {
            try {
                orderService.updatePaymentStatus(orderId, PaymentStatus.FAILED);
            } catch (Exception ex) {
                // Ignore update errors
            }
            return false;
        }
    }

    public void handleSuccessfulPayment(String orderId, String razorpayPaymentId) {
        try {
            orderService.updatePaymentStatus(orderId, PaymentStatus.COMPLETED);
        } catch (Exception e) {
            System.err.println("Failed to handle successful payment: " + e.getMessage());
        }
    }

    public void handleFailedPayment(String orderId) {
        try {
            orderService.updatePaymentStatus(orderId, PaymentStatus.FAILED);
        } catch (Exception e) {
            System.err.println("Failed to handle failed payment: " + e.getMessage());
        }
    }

    public PaymentResponse createRazorpayOrderForExistingOrder(String orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            
            // If Razorpay client is not initialized, create dummy response
            if (razorpayClient == null) {
                PaymentResponse dummyResponse = new PaymentResponse();
                dummyResponse.setRazorpayOrderId("dummy_" + orderId);
                dummyResponse.setAmount(String.valueOf(order.getTotalAmount()));
                dummyResponse.setCurrency("INR");
                dummyResponse.setKey("dummy_key");
                return dummyResponse;
            }
            
            JSONObject options = new JSONObject();
            options.put("amount", order.getTotalAmount().multiply(new BigDecimal("100")).intValue());
            options.put("currency", "INR");
            options.put("receipt", orderId);
            options.put("payment_capture", 1);
            
            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
            
            PaymentResponse paymentResponse = new PaymentResponse();
            paymentResponse.setRazorpayOrderId(razorpayOrder.get("id"));
            paymentResponse.setAmount(String.valueOf(order.getTotalAmount()));
            paymentResponse.setCurrency("INR");
            paymentResponse.setKey(razorpayKeyId);
            
            return paymentResponse;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }
}