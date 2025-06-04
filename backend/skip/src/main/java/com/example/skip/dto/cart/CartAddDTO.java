package com.example.skip.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartAddDTO {
    private Long itemDetailId;
    private int quantity;
    private LocalDateTime rentStart;
    private LocalDateTime rentEnd;

}
