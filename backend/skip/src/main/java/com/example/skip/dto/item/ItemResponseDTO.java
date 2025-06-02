package com.example.skip.dto.item;

import com.example.skip.enumeration.YesNo;
<<<<<<< HEAD
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
=======
import lombok.*;
>>>>>>> fb6632eb9f5db4c55aa17840ded0afe6d41061f1

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
<<<<<<< HEAD
}
=======
}
>>>>>>> fb6632eb9f5db4c55aa17840ded0afe6d41061f1
