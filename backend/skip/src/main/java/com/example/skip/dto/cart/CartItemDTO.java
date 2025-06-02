package com.example.skip.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long cartId;
    private String itemName;   //item.name (itemDetail-> itemId-> itemName)
    private String image;    //item.image (itemDetail -> itemId -> image)
    private String size;    //itemDetail.size
    private Integer quantity;
    private Integer price;
    private String rentStart;  // yyyy-MM-dd'T'HH:mm:ss 형식의 문자열
    private String rentEnd;    // yyyy-MM-dd'T'HH:mm:ss 형식의 문자열
}
