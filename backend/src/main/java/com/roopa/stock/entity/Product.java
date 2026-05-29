package com.roopa.stock.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product", schema = "public")
@Data
@NoArgsConstructor
public class Product {  // <-- CAPITAL P - THIS LINE IS CRITICAL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int quantity;
    private double price;
    private String category;
}