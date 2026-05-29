package com.roopa.stock.repository;

import com.roopa.stock.entity.users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<users, Long> {
    Optional<users> findByEmail(String email);
    boolean existsByEmail(String email);
}