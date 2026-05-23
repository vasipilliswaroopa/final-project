package com.roopa.stock.controller;

import com.roopa.stock.entity.Product;
import com.roopa.stock.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;


    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }


    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}