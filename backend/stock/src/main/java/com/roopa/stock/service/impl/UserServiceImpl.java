package com.roopa.stock.service.impl;

import com.roopa.stock.dto.UserDTO;
import com.roopa.stock.entity.users;
import com.roopa.stock.repository.UserRepository;
import com.roopa.stock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Secure SHA-256 password hashing helper function (retained for backward compatibility checks)
    private String hashPassword(String password) {
        if (password == null) return null;
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error securely hashing credentials", e);
        }
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        users user = mapToEntity(userDTO);
        // Secure password before persistence using BCrypt
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        users savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    @Override
    public UserDTO getUserById(Long id) {
        users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<users> users = userRepository.findAll();
        return users.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            // Secure new password before update using BCrypt
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        users updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO login(String email, String password) {
        users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        String encodedPassword = user.getPassword();

        if (passwordEncoder.matches(password, encodedPassword)) {
            // Valid BCrypt match
            return mapToDTO(user);
        }

        // Check legacy formats (SHA-256 or plain text)
        String hashedIncomingSha256 = hashPassword(password);
        if (encodedPassword.equals(hashedIncomingSha256) || encodedPassword.equals(password)) {
            // Valid legacy match! Upgrade user to BCrypt immediately
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return mapToDTO(user);
        }

        throw new RuntimeException("Invalid email or password");
    }

    private UserDTO mapToDTO(users user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    private users mapToEntity(UserDTO dto) {
        users user = new users();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        return user;
    }
}