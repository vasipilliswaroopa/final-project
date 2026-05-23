package com.roopa.stock.service.impl;

import com.roopa.stock.dto.UserDTO;
import com.roopa.stock.entity.users;
import com.roopa.stock.repository.UserRepository;
import com.roopa.stock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // Secure SHA-256 password hashing helper function
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
        // Secure password before persistence
        user.setPassword(hashPassword(userDTO.getPassword()));
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
            // Secure new password before update
            user.setPassword(hashPassword(userDTO.getPassword()));
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
        
        String hashedIncoming = hashPassword(password);

        // Soft Security: Check for plain-text password match first (backwards compatibility).
        // If it matches, upgrade/migrate the user to a secure SHA-256 hash immediately.
        if (user.getPassword().equals(password)) {
            user.setPassword(hashedIncoming);
            userRepository.save(user);
        } else if (!user.getPassword().equals(hashedIncoming)) {
            throw new RuntimeException("Invalid email or password");
        }

        return mapToDTO(user);
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