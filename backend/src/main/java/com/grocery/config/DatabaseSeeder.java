package com.grocery.config;

import com.grocery.entity.User;
import com.grocery.entity.User.Role;
import com.grocery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User admin = userRepository.findByEmail("admin@freshmart.com").orElse(new User());
        admin.setName("Admin User");
        admin.setEmail("admin@freshmart.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        System.out.println("✅ Admin demo user password reset/created!");

        User customer = userRepository.findByEmail("user@freshmart.com").orElse(new User());
        customer.setName("Demo Customer");
        customer.setEmail("user@freshmart.com");
        customer.setPassword(passwordEncoder.encode("user123"));
        customer.setRole(Role.CUSTOMER);
        userRepository.save(customer);
        System.out.println("✅ Customer demo user password reset/created!");
    }
}
