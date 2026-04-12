package com.example.food.service;

import com.example.food.dto.catering.CateringServiceResponse;
import com.example.food.dto.catering.CreateCateringServiceRequest;
import com.example.food.entity.CateringService;
import com.example.food.entity.Users;
import com.example.food.entity.Vendor;
import com.example.food.enums.ApprovalStatus;
import com.example.food.repository.CateringServiceRepo;
import com.example.food.repository.UserRepo;
import com.example.food.repository.VendorRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CateringServiceService {

    private final CateringServiceRepo repo;
    private final UserRepo userRepo;
    private final VendorRepo vendorRepo;

    @Transactional
    public CateringServiceResponse createService(CreateCateringServiceRequest request, String email) {
        // Optimization: Use getReferenceByEmail or similar to avoid full object load if only ID is needed
        Users user = userRepo.findByEmail(email);

        if (user == null) throw new RuntimeException("User not found");

        CateringService service = new CateringService();
        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setPricePerPlate(request.getPricePerPlate());
        service.setMinOrderQuantity(request.getMinOrderQuantity());
        service.setAvailable(true);
        service.setApprovalStatus(ApprovalStatus.PENDING);
        service.setVendor(user);

        CateringService saved = repo.save(service);
        return mapToResponse(saved);
    }

    public List<CateringServiceResponse> getAllApprovedServices() {
        return repo.findByApprovalStatusAndAvailableTrue(ApprovalStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CateringServiceResponse mapToResponse(CateringService service) {
        Vendor vendorProfile = vendorRepo.findByUser(service.getVendor());
        return CateringServiceResponse.builder()
                .serviceId(service.getServiceId())
                .serviceName(service.getServiceName())
                .description(service.getDescription())
                .pricePerPlate(service.getPricePerPlate())
                .minOrderQuantity(service.getMinOrderQuantity())
                .vendorBusinessName(vendorProfile != null ? vendorProfile.getBusinessName() : service.getVendor().getUsername())
                .vendorEmail(service.getVendor().getEmail())
                .build();
    }

    public List<CateringServiceResponse> getAllServices(String email) {
        Users user = userRepo.findByEmail(email);
        return repo.findByVendor(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
