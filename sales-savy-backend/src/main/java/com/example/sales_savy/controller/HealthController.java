package com.example.sales_savy.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    
    @GetMapping
    public String healthCheck() {
        return "Backend is healthy and running!";
    }
}
