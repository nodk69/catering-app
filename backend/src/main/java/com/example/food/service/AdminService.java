package com.example.food.service;

import com.example.food.entity.CateringService;
import com.example.food.enums.ApprovalStatus;
import com.example.food.repository.CateringServiceRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CateringServiceRepo repo;

    public List<CateringService> getPendingServices() {
        return repo.findByApprovalStatus(ApprovalStatus.PENDING);
    }

    @Transactional
    public CateringService approveService(Long id) {
        CateringService service = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + id));

        service.setApprovalStatus(ApprovalStatus.APPROVED);
        return repo.save(service);
    }

    @Transactional
    public CateringService rejectService(Long id) {
        CateringService service = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + id));

        service.setApprovalStatus(ApprovalStatus.REJECTED);
        return repo.save(service);
    }
}