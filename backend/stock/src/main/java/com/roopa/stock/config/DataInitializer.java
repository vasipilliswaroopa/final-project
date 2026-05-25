package com.roopa.stock.config;

import com.roopa.stock.entity.users;
import com.roopa.stock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            users admin = new users();
            admin.setName("Admin");
            admin.setEmail("admin@example.com");
            // Hash "admin123" with SHA-256 for compatibility with the UserServiceImpl hashPassword
            admin.setPassword(hashPassword("admin123"));
            userRepository.save(admin);
            System.out.println("No users found in database. Seeded default admin user: admin@example.com / admin123");
        }
    }

    private String hashPassword(String password) {
        if (password == null) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
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
}
