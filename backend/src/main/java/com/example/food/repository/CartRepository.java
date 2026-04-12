package com.example.food.repository;

import com.example.food.entity.Cart;
import com.example.food.entity.MenuItem;
import com.example.food.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUser(Users user);

    @Query("SELECT c FROM Cart c JOIN FETCH c.menuItem WHERE c.user = :user")
    List<Cart> findByUserWithDetails(@Param("user") Users user);

    Optional<Cart> findByUserAndMenuItem(Users user, MenuItem menuItem);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.user = :user")
    void deleteByUser(@Param("user") Users user);
}
