package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemDetailPageDTO {
    private Long itemId;
    private String name;
    private String image;
    private String category;
    private List<ItemDetailFlatDTO> detailList;
}
