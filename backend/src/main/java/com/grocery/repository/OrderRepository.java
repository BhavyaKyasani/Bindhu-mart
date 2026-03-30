package com.grocery.repository;

import com.grocery.entity.Order;
import com.grocery.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);

    Page<Order> findAllByOrderByOrderDateDesc(Pageable pageable);

    long countByOrderStatus(Order.OrderStatus status);
}
