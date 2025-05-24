package com.example.skip.dto;

import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ItemRequestDTO {
    private Long itemId;
    private Long rentId;
    private String category;
    private String name;
    private MultipartFile image;
    private List<DetailGroup> detailList;

    @Getter
    @Setter
    public static class DetailGroup {
        private Integer rentHour;
        private Integer price;
        private List<SizeStock> sizeStockList;
    }

    @Getter
    @Setter
    public static class SizeStock {
        private String size;
        private Integer totalQuantity;
        private Integer stockQuantity;
    }
}
