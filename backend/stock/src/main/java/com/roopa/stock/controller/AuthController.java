package com.roopa.stock.controller;

import com.roopa.stock.dto.LoginRequest;
import com.roopa.stock.dto.LoginResponse;
import com.roopa.stock.dto.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://final-project-twxp.vercel.app"})
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            return ResponseEntity.ok(new LoginResponse("Login success", request.getEmail()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
        }
    }
}