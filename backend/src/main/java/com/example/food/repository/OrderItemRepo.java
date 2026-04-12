package com.example.food.repository;

import com.example.food.entity.OrderItem;
import com.example.food.entity.CateringOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {

    // Get all items by order entity
    List<OrderItem> findByOrder(CateringOrder order);

    // Get all items by order ID - KEEP ONLY THIS ONE
    List<OrderItem> findByOrder_OrderId(Long orderId);
}
