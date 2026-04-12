package com.example.food.repository;


import com.example.food.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users,Integer> {
    Users findByUsername(String username);
    Users findByEmail(String email);
}
