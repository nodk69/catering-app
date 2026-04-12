package com.example.food.controller;

import com.example.food.entity.CateringService;
import com.example.food.entity.Users;
import com.example.food.repository.CateringServiceRepo;
import com.example.food.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/vendor")
public class VendorController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CateringServiceRepo repo;

    @PreAuthorize("hasRole('VENDOR')")
    @GetMapping("/my-services")
    public List<CateringService> myServices(Principal principal) {

        Users vendor = userRepo.findByEmail(principal.getName());

        return repo.findByVendor(vendor);
    }
}
