package com.example.food.entity;

import com.example.food.enums.OrderStatus;
import com.example.food.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "catering_orders")
public class CateringOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "total_quantity")
    private Integer totalQuantity;

    @Column(name = "subtotal")
    private Double subtotal;

    @Column(name = "service_charge")
    private Double serviceCharge;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_address")
    private String eventAddress;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "guest_count")
    private Integer guestCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "order_date")
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "delivered_date")
    private LocalDateTime deliveredDate;

    @Column(name = "cancelled_date")
    private LocalDateTime cancelledDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Users customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catering_id")
    private CateringService cateringService;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // Helper methods
    public String getOrderNumber() {
        return "ORD-" + String.format("%06d", orderId);
    }

    public Double calculateSubtotal() {
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    // Payment related fields
    private String paymentMethod; // "COD", "RAZORPAY"

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private LocalDateTime paidAt;
}

