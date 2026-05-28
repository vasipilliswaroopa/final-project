package com.roopa.stock.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public Long getId() { return id; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setName(String name) { this.name = name; }
    public void setId(Long id) { this.id = id; }
}