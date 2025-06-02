package com.example.skip.dto.item;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ItemConfirmDTO {
    private Long itemId;
    private Long rentId;
    private String category;
    private String name;
    private MultipartFile image;
    private List<DetailGroups> detailList;       // 시간·가격만 나오는 그룹
    private List<SizeStocks> sizeStockList;      // 사이즈 수량 공용 리스트

    @Getter
    @Setter
    @ToString
    public static class DetailGroups {
        private Long itemDetailId;
        private Integer rentHour;
        private Integer price;
    }

    @Getter
    @Setter
    @ToString
    public static class SizeStocks {
        private String size;
        private Integer totalQuantity;
        private Integer stockQuantity;
    }

}
