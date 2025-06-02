package com.example.skip.dto.item;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SizeStockDTO {
    private String size;
    private int totalQuantity;
    private int stockQuantity;
}
