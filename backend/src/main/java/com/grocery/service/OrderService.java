package com.grocery.service;

import com.grocery.dto.OrderResponse;
import com.grocery.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(String email);

    List<OrderResponse> getMyOrders(String email);

    OrderResponse getOrderById(Long id, String email);

    Page<OrderResponse> getAllOrders(Pageable pageable);

    OrderResponse updateOrderStatus(Long id, Order.OrderStatus status);
}
