package com.example.skip.dto;

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

    private String rentName;     // item.rent.name
    private Long itemId;
    private String itemName;     // item.name
    private String image;        // item.image
    private String size;         // itemDetail.size
    private Integer price;       // itemDetail.price
    private YesNo isActive;      // itemDetail.isActive
}
