package com.grocery.service;

import com.grocery.dto.CartItemRequest;
import com.grocery.dto.CartResponse;

public interface CartService {
    CartResponse getCart(String email);

    CartResponse addToCart(String email, CartItemRequest request);

    CartResponse updateCartItem(String email, Long cartItemId, Integer quantity);

    CartResponse removeFromCart(String email, Long cartItemId);

    void clearCart(String email);
}
