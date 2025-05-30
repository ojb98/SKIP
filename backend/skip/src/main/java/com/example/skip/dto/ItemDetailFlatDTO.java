package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemDetailFlatDTO {
    private Long itemDetaild;
    private Integer rentHour;
    private Integer price;
    private String size;
    private Integer stockQuantity;
}
