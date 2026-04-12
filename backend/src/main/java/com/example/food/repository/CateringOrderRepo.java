package com.example.food.repository;

import com.example.food.entity.CateringOrder;
import com.example.food.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CateringOrderRepo extends JpaRepository<CateringOrder, Long> {

    List<CateringOrder> findByCustomer_EmailOrderByOrderDateDesc(String email);

    Page<CateringOrder> findByCustomer_EmailOrderByOrderDateDesc(String email, Pageable pageable);

    Page<CateringOrder> findByCateringService_Vendor_EmailOrderByOrderDateDesc(String email, Pageable pageable);

    Page<CateringOrder> findByCateringService_Vendor_EmailAndStatusOrderByOrderDateDesc(
            String email, OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM CateringOrder o JOIN FETCH o.items WHERE o.orderId = :orderId")
    java.util.Optional<CateringOrder> findByIdWithItems(@Param("orderId") Long orderId);
}