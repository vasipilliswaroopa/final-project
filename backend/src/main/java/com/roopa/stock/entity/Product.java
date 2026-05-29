package com.roopa.stock.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "product", schema = "public")
@Data
@NoArgsConstructor
public class Product {  // <-- CAPITAL P - THIS LINE IS CRITICAL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "quantity")
    @JsonProperty("quantity")
    private int stock_quantity;

    @Column(name = "price")
    @JsonProperty("price")
    private double unit_price;

    private String category;
}