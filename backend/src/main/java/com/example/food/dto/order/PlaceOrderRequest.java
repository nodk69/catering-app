package com.example.food.dto.order;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PlaceOrderRequest {
    private Long cateringServiceId;
    private List<OrderItemRequest> items;
    private LocalDate eventDate;
    private String eventAddress;
    private String eventType;
    private Integer guestCount;
    private boolean fromCart; // To know if order is from cart

    private String paymentMethod = "COD";
}
