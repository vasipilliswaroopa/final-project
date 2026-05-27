package com.roopa.stock.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor  // Needed for JSON deserialization
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}