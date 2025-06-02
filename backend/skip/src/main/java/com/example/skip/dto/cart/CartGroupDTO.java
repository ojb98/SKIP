package com.example.skip.dto.cart;

import jdk.jfr.Name;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartGroupDTO {
    private Long rentId;
    private String name;   //rentNeme
    private List<CartItemDTO> items;
}
