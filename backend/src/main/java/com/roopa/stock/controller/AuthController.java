package com.roopa.stock.controller;

import com.roopa.stock.config.JwtService;
import com.roopa.stock.dto.LoginRequest;
import com.roopa.stock.dto.LoginResponse;
import com.roopa.stock.dto.ErrorResponse;
import com.roopa.stock.dto.UserDTO;
import com.roopa.stock.entity.users;
import com.roopa.stock.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://final-project.vercel.app")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authManager, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.authManager = authManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("[AuthController] POST /api/auth/login request: email={}", request.getEmail());
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            users user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            String token = jwtService.generateToken(user.getEmail());
            LoginResponse response = new LoginResponse(
                    token,
                    user.getName(),
                    user.getEmail(),
                    user.getId(),
                    "USER"
            );
            log.info("[AuthController] POST /api/auth/login response: success for email={}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            log.error("[AuthController] POST /api/auth/login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Invalid email or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO request) {
        log.info("[AuthController] POST /api/auth/register request: email={}, name={}", request.getEmail(), request.getName());
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("[AuthController] POST /api/auth/register email already exists: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Email is already registered"));
        }
        users user = new users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        UserDTO responseDTO = new UserDTO();
        responseDTO.setId(user.getId());
        responseDTO.setName(user.getName());
        responseDTO.setEmail(user.getEmail());
        log.info("[AuthController] POST /api/auth/register response: success for email={}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
}