package com.roopa.stock.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Stock Backend API is running!";
    }

    @GetMapping("/health")
    public String health() {
        return "UP";
    }
}