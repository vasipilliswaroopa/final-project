package com.roopa.stock.controller;

import com.roopa.stock.entity.Product;
import com.roopa.stock.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "https://final-project.vercel.app")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {  // <-- Capital P
        List<Product> products = productRepository.findAll();
        log.info("Found {} products", products.size());
        return products;
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