package com.grocery.service;

import com.grocery.dto.AuthRequest;
import com.grocery.dto.AuthResponse;
import com.grocery.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(AuthRequest request);
}
