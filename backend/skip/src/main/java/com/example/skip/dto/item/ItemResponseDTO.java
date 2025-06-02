package com.example.skip.dto.item;

import com.example.skip.enumeration.YesNo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDTO {
    private Long itemId;
    private String name;
    private String category;
    private String image;
    private List<ItemDetailDTO> detailList;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDetailDTO {
        private Long itemDetailId;
        private Integer rentHour;
        private Integer price;
        private String size;
        private Integer totalQuantity;
        private Integer stockQuantity;
        private YesNo isActive;
    }
}
