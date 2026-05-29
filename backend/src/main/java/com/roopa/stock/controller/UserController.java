package com.roopa.stock.controller;

import com.roopa.stock.dto.UserDTO;
import com.roopa.stock.entity.users;
import com.roopa.stock.repository.UserRepository;
import com.roopa.stock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "https://final-project.vercel.app")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        log.info("[UserController] POST /api/users request: {}", userDTO);
        UserDTO created = userService.createUser(userDTO);
        log.info("[UserController] POST /api/users response: {}", created);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO loginDTO) {
        log.info("[UserController] POST /api/users/login request: email={}", loginDTO.getEmail());
        try {
            UserDTO user = userService.login(loginDTO.getEmail(), loginDTO.getPassword());
            log.info("[UserController] POST /api/users/login response: success for email={}", loginDTO.getEmail());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("[UserController] POST /api/users/login exception: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        log.info("[UserController] GET /api/users/{} request", id);
        UserDTO user = userService.getUserById(id);
        log.info("[UserController] GET /api/users/{} response: {}", id, user);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        log.info("[UserController] GET /api/users request");
        List<UserDTO> usersList = userService.getAllUsers();
        log.info("[UserController] GET /api/users response: returning {} users", usersList.size());
        return ResponseEntity.ok(usersList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        log.info("[UserController] PUT /api/users/{} request: {}", id, userDTO);
        try {
            users user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
            user.setName(userDTO.getName());
            user.setEmail(userDTO.getEmail());
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }
            users savedUser = userRepository.save(user);
            
            UserDTO responseDTO = new UserDTO();
            responseDTO.setId(savedUser.getId());
            responseDTO.setName(savedUser.getName());
            responseDTO.setEmail(savedUser.getEmail());
            
            log.info("[UserController] PUT /api/users/{} response: success", id);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("[UserController] PUT /api/users/{} exception: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Update Failed - An unexpected error occurred: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        log.info("[UserController] DELETE /api/users/{} request", id);
        userService.deleteUser(id);
        log.info("[UserController] DELETE /api/users/{} completed", id);
        return ResponseEntity.ok("User deleted successfully");
    }
}