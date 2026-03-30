package com.grocery.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Min(value = 0)
    private Integer stock;

    private String imageUrl;
    private String unit;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private Boolean active = true;
}
