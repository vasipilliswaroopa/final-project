package com.roopa.stock.controller;

import com.roopa.stock.entity.Product;
import com.roopa.stock.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {  // <-- Capital P
        return productRepository.findAll();  // <-- lowercase p
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {  // <-- Capital P both times
        return productRepository.save(product);  // <-- lowercase p
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);  // <-- lowercase p
    }
}