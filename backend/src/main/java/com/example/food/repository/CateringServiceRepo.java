package com.example.food.repository;

import com.example.food.entity.CateringService;
import com.example.food.entity.Users;
import com.example.food.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CateringServiceRepo extends JpaRepository<CateringService, Long> {

    // Get all services by vendor
    List<CateringService> findByVendor(Users vendor);

    // Only available services
    List<CateringService> findByAvailableTrue();

    List<CateringService> findByApprovalStatus(ApprovalStatus status);

    @Query("SELECT s FROM CateringService s JOIN FETCH s.vendor u WHERE s.approvalStatus = :status AND s.available = true")
    List<CateringService> findByApprovalStatusAndAvailableTrue(ApprovalStatus status);

}