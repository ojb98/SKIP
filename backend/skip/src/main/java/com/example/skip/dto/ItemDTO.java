package com.example.skip.dto;

import com.example.skip.entity.Item;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ItemDTO {
    private Long itemId;
    private Long rentId;
    private String name;
    private String size;
    private Integer totalQuantity;
    private Integer stockQuantity;
    private String image;
    private ItemCategory category;
    private Integer rentHour;
    private Integer price;
    private YesNo isActive;
    private LocalDate createdAt;

    public ItemDTO(Item item){
        this.itemId=item.getItemId();
        this.rentId=item.getRent().getRentId();
        this.name=item.getName();
        this.size=item.getSize();
        this.totalQuantity=item.getTotalQuantity();
        this.stockQuantity=item.getStockQuantity();
        this.image=item.getImage();
        this.category=item.getCategory();
        this.rentHour=item.getRentHour();
        this.price=item.getPrice();
        this.isActive=item.getIsActive();
        this.createdAt=item.getCreatedAt();
    }

    public Item toEntity(Rent rent){
        return Item.builder()
                .itemId(itemId)
                .rent(rent)
                .name(name)
                .size(size)
                .totalQuantity(totalQuantity)
                .stockQuantity(stockQuantity)
                .image(image)
                .category(category)
                .rentHour(rentHour)
                .price(price)
                .isActive(isActive)
                .build();
    }
}
