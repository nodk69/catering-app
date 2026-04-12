package com.example.food.service;

import com.example.food.dto.menu.BulkMenuItemRequest;
import com.example.food.dto.menu.MenuItemRequest;
import com.example.food.entity.CateringService;
import com.example.food.entity.MenuItem;
import com.example.food.repository.CateringServiceRepo;
import com.example.food.repository.MenuItemRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepo menuRepo;
    private final CateringServiceRepo serviceRepo;

    @Transactional
    public MenuItem addMenu(Long serviceId, MenuItemRequest request, String vendorEmail) {
        // 1. SECURITY: Fetch the service to verify ownership
        CateringService service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // 2. SECURITY: Check if the logged-in vendor actually owns this service
        if (!service.getVendor().getEmail().equals(vendorEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this catering service");
        }

        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());

        // Link the service
        item.setCateringService(service);

        return menuRepo.save(item);
    }

    public List<MenuItem> getMenuByService(Long serviceId) {
        // Use a projection or DTO here to avoid loading the whole CateringService object
        return menuRepo.findByCateringService_ServiceId(serviceId);
    }

    @Transactional
    public List<MenuItem> addBulkMenu(Long serviceId, BulkMenuItemRequest request, String vendorEmail) {
        // 1. Fetch service and check ownership (1 DB hit)
        CateringService service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        if (!service.getVendor().getEmail().equals(vendorEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You do not own this service");
        }

        // 2. Map DTOs to Entities
        List<MenuItem> menuItems = request.getItems().stream()
                .map(itemDto -> {
                    MenuItem item = new MenuItem();
                    item.setName(itemDto.getName());
                    item.setCategory(itemDto.getCategory());
                    item.setPrice(itemDto.getPrice());
                    item.setCateringService(service);
                    return item;
                })
                .collect(Collectors.toList());

        // 3. Batch Save (Optimized by JPA)
        return menuRepo.saveAll(menuItems);
    }
}
