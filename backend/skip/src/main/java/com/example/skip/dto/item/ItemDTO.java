package com.example.skip.dto.item;

import com.example.skip.entity.Item;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.ItemCategory;
import lombok.*;

import java.time.LocalDate;


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
    private String image;
    private ItemCategory category;
    private LocalDate createdAt;

    public ItemDTO(Item item){
        this.itemId=item.getItemId();
        this.rentId=item.getRent().getRentId();
        this.name=item.getName();
        this.image=item.getImage();
        this.category=item.getCategory();
        this.createdAt=item.getCreatedAt();
    }

    public Item toEntity(Rent rent){
        return Item.builder()
                .itemId(itemId)
                .rent(rent)
                .name(name)
                .image(image)
                .category(category)
                .build();
    }
}