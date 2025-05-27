package com.example.skip.dto;

import com.example.skip.entity.Item;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import lombok.*;

import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ItemDetailDTO {
    private Long itemDetailId;
    private Long itemId;
    private String size;
    private Integer totalQuantity;
    private Integer stockQuantity;
    private Integer rentHour;
    private Integer price;
    private YesNo isActive;


    public ItemDetailDTO(ItemDetail itemDetail){
        this.itemDetailId=itemDetail.getItemDetailId();
        this.itemId=itemDetail.getItem().getItemId();
        this.totalQuantity=itemDetail.getTotalQuantity();
        this.stockQuantity=itemDetail.getStockQuantity();
        this.rentHour=itemDetail.getRentHour();
        this.price=itemDetail.getPrice();
        this.isActive=itemDetail.getIsActive();

    }

    public ItemDetail toEntity(Item item){
        return ItemDetail.builder()
                .itemDetailId(itemDetailId)
                .item(item)
                .size(size)
                .totalQuantity(totalQuantity)
                .stockQuantity(stockQuantity)
                .rentHour(rentHour)
                .price(price)
                .isActive(isActive)
                .build();
    }
}
