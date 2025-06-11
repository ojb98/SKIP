package com.example.skip.dto;

import com.example.skip.entity.Item;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Rent;
import com.example.skip.entity.WishList;
import com.example.skip.enumeration.YesNo;
import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishListDTO {

    private Long wishlistId;
    private Long userId;
    private Long itemDetailId;
    private LocalDate createdAt;

    private Long rentId;         // item.rent.rentId
    private String rentName;     // item.rent.name
    private Long itemId;
    private String itemName;     // item.name
    private String image;        // item.image
    private String size;         // itemDetail.size
    private Integer price;       // itemDetail.price
    private YesNo isActive;      // itemDetail.isActive

    // 복잡한 연관관계(Entity → 다른 Entity)를 DTO에 깔끔하게 매핑
    public static WishListDTO from(WishList wishList) {
        ItemDetail itemDetail = wishList.getItemDetail();
        Item item = itemDetail.getItem();
        Rent rent = item.getRent();

        return new WishListDTO(
                wishList.getWishlistId(),
                wishList.getUser().getUserId(),
                itemDetail.getItemDetailId(),
                wishList.getCreatedAt(),
                rent.getRentId(),
                rent.getName(),
                item.getItemId(),
                item.getName(),
                item.getImage(),
                itemDetail.getSize(),
                itemDetail.getPrice(),
                itemDetail.getIsActive()
        );
    }
}
