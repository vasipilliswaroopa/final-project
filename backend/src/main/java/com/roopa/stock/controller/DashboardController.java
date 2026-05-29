package com.roopa.stock.controller;

import com.roopa.stock.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("categories", productRepository.countDistinctCategories());
        stats.put("products", productRepository.count());
        stats.put("inStock", productRepository.countByQuantityGreaterThan(0));
        stats.put("outOfStock", productRepository.countByQuantityEquals(0));
        return stats;
    }
}