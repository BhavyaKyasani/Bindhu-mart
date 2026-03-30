package com.grocery.service;

import com.grocery.dto.ProductRequest;
import com.grocery.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<ProductResponse> getAllProducts(Pageable pageable);

    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    Page<ProductResponse> searchProducts(String query, Long categoryId, Pageable pageable);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getFeaturedProducts();

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}
