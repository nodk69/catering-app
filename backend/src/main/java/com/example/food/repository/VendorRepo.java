package com.example.food.repository;

import com.example.food.entity.Users;
import com.example.food.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepo extends JpaRepository<Vendor, Long> {
    // You can add a method to find vendor by user email if needed
    Vendor findByUserEmail(String email);

    Vendor findByUser(Users user);
}