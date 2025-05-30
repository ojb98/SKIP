package com.example.skip.dto.item;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
//클래스 안에 또 다른 클래스를 정의하는 것도 중첩 구조 (Nested Class)
public class ItemRequestDTO {
    private Long itemId;
    private Long rentId;
    private String category;
    private String name;
    private MultipartFile image;
    private List<DetailGroup> detailList;  //Nesting 구조(중첩 구조)

    @Getter
    @Setter
    //중첩 클래스
    public static class DetailGroup {
        private Long itemDetailId;
        private Integer rentHour;
        private Integer price;
        private List<SizeStock> sizeStockList;
    }

    @Getter
    @Setter
    //중첩 클래스
    public static class SizeStock {
        private String size;
        private Integer totalQuantity;
        private Integer stockQuantity;
    }
}