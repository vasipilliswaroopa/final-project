package com.roopa.stock.dto;

public class LoginResponse {
    private String message;
    private String email;
    private String token;
    private Long id;
    private String name;

    // No-argument constructor
    public LoginResponse() {
    }

    // All-arguments constructor
    public LoginResponse(String message, String email, String token, Long id, String name) {
        this.message = message;
        this.email = email;
        this.token = token;
        this.id = id;
        this.name = name;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}