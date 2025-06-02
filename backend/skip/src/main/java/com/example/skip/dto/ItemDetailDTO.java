package com.example.skip.dto;

import com.example.skip.entity.ItemDetail;
import com.example.skip.enumeration.YesNo;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ItemDetailDTO {
    private Long itemDetailId;
    private String size;
    private Integer totalQuantity;
    private Integer stockQuantity;
    private Integer rentHour;
    private Integer price;
    private YesNo isActive;

    // Entity → DTO
    public ItemDetailDTO(ItemDetail itemDetail) {
        this.itemDetailId = itemDetail.getItemDetailId();
        this.size = itemDetail.getSize();
        this.totalQuantity = itemDetail.getTotalQuantity();
        this.stockQuantity = itemDetail.getStockQuantity();
        this.rentHour = itemDetail.getRentHour();
        this.price = itemDetail.getPrice();
        this.isActive = itemDetail.getIsActive();
    }
}
