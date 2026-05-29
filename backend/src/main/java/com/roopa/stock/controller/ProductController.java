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
        log.info("[ProductController] GET /api/products request received");
        List<Product> products = productRepository.findAll();
        System.out.println("Found " + products.size() + " products");
        log.info("[ProductController] GET /api/products response: returning {} products", products.size());
        return products;
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {  // <-- Capital P both times
        log.info("[ProductController] POST /api/products request received: {}", product);
        Product saved = productRepository.save(product);  // <-- lowercase p
        log.info("[ProductController] POST /api/products response: {}", saved);
        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        log.info("[ProductController] DELETE /api/products/{} request received", id);
        productRepository.deleteById(id);  // <-- lowercase p
        log.info("[ProductController] DELETE /api/products/{} completed", id);
    }
}