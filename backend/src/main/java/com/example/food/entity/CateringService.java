package com.example.food.entity;

import com.example.food.enums.ApprovalStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CateringService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    private String serviceName;
    private String description;
    private Double pricePerPlate;
    private Integer minOrderQuantity;
    private Boolean available;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Users vendor;
}
