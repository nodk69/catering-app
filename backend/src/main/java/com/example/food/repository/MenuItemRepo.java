package com.example.food.repository;

import com.example.food.entity.MenuItem;
import com.example.food.entity.CateringService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepo extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByCateringService_ServiceId(Long serviceId);
}
