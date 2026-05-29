package com.roopa.stock.repository;

import com.roopa.stock.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    long countByQuantityGreaterThan(int quantity);

    long countByQuantityEquals(int quantity);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT p.category) FROM Product p")
    long countDistinctCategories();
}