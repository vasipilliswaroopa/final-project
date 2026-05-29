package com.roopa.stock.repository;

import com.roopa.stock.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock_quantity > :quantity")
    long countByQuantityGreaterThan(@Param("quantity") int quantity);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock_quantity = :quantity")
    long countByQuantityEquals(@Param("quantity") int quantity);

    @Query("SELECT COUNT(DISTINCT p.category) FROM Product p")
    long countDistinctCategories();
}