package com.example.food.service;

import com.example.food.dto.cart.CartItemRequest;
import com.example.food.dto.cart.CartItemResponse;
import com.example.food.dto.cart.CartResponse;
import com.example.food.entity.Cart;
import com.example.food.entity.CateringService;
import com.example.food.entity.MenuItem;
import com.example.food.entity.Users;
import com.example.food.repository.CartRepository;
import com.example.food.repository.CateringServiceRepo;
import com.example.food.repository.MenuItemRepo;
import com.example.food.repository.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepo;
    private final UserRepo userRepo;
    private final MenuItemRepo menuRepo;
    private final CateringServiceRepo serviceRepo;

    @Transactional
    public CartResponse addToCart(String email, CartItemRequest request) {
        Users user = userRepo.findByEmail(email);
        MenuItem menuItem = menuRepo.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found"));

        // Validate all items are from same service
        List<Cart> existingItems = cartRepo.findByUser(user);
        if (!existingItems.isEmpty() &&
                !existingItems.get(0).getCateringService().getServiceId().equals(request.getServiceId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot mix items from different services. Clear cart first.");
        }

        // Check if item already in cart
        Cart cart = cartRepo.findByUserAndMenuItem(user, menuItem)
                .orElse(new Cart());

        if (cart.getId() == null) {
            cart.setUser(user);
            cart.setMenuItem(menuItem);
            cart.setCateringService(menuItem.getCateringService());
            cart.setQuantity(request.getQuantity());
        } else {
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
        }

        cartRepo.save(cart);
        return getCart(email);
    }

    public CartResponse getCart(String email) {
        Users user = userRepo.findByEmail(email);
        List<Cart> cartItems = cartRepo.findByUserWithDetails(user);

        if (cartItems.isEmpty()) {
            return CartResponse.builder()
                    .items(List.of())
                    .subtotal(0.0)
                    .totalItems(0)
                    .build();
        }

        List<CartItemResponse> items = cartItems.stream()
                .map(this::mapToCartItemResponse)
                .toList();

        double subtotal = items.stream().mapToDouble(CartItemResponse::getTotal).sum();
        CateringService service = cartItems.get(0).getCateringService();

        return CartResponse.builder()
                .items(items)
                .subtotal(subtotal)
                .totalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum())
                .serviceId(service.getServiceId())
                .serviceName(service.getServiceName())
                .build();
    }

    @Transactional
    public CartResponse updateQuantity(String email, Long cartItemId, int quantity) {
        Cart cart = validateCartOwnership(email, cartItemId);

        if (quantity <= 0) {
            cartRepo.delete(cart);
        } else {
            cart.setQuantity(quantity);
            cartRepo.save(cart);
        }

        return getCart(email);
    }

    @Transactional
    public void removeItem(String email, Long cartItemId) {
        Cart cart = validateCartOwnership(email, cartItemId);
        cartRepo.delete(cart);
    }

    @Transactional
    public void clearCart(String email) {
        Users user = userRepo.findByEmail(email);
        cartRepo.deleteByUser(user);
    }

    private Cart validateCartOwnership(String email, Long cartItemId) {
        Cart cart = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!cart.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return cart;
    }

    private CartItemResponse mapToCartItemResponse(Cart cart) {
        return CartItemResponse.builder()
                .cartItemId(cart.getId())
                .menuItemId(cart.getMenuItem().getId())
                .menuItemName(cart.getMenuItem().getName())
                .quantity(cart.getQuantity())
                .price(cart.getMenuItem().getPrice())
                .total(cart.getMenuItem().getPrice() * cart.getQuantity())
                .build();
    }
}
