package com.example.skip.dto.item;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OptionRequestDTO {
    private int rentHour;
    private int price;
    private List<SizeStockDTO> sizeStocks;
}
