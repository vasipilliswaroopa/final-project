package com.roopa.stock.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "API is running");
        response.put("service", "stock-backend-api");
        response.put("javaVersion", "21");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/api/stocks")
    public ResponseEntity<List<Map<String, Object>>> getStocks() {
        Map<String, Object> stock1 = new HashMap<>();
        stock1.put("symbol", "AAPL");
        stock1.put("price", 150.25);

        Map<String, Object> stock2 = new HashMap<>();
        stock2.put("symbol", "TSLA");
        stock2.put("price", 220.10);

        return ResponseEntity.ok(List.of(stock1, stock2));
    }
}