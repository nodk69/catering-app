package com.example.food.dto.menu;

import lombok.Data;

import java.util.List;

@Data
public class BulkMenuItemRequest {
    private List<MenuItemRequest> items;
}
