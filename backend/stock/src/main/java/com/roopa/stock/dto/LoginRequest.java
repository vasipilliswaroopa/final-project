package com.roopa.stock.dto;

public class LoginRequest {
    private String username;
    private String password;
    private String email;
    private Long id;
    private String role;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password, String email, Long id, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.id = id;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}