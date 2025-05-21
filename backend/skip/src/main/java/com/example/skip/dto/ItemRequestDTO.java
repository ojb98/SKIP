package com.example.skip.dto;

import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ItemRequestDTO {
    private Long itemId;
    private Long rentId;
    private String name;
    private String size;
    private Integer totalQuantity;
    private Integer stockQuantity;
    private MultipartFile image;
    private ItemCategory category;
    private Integer rentHour;
    private Integer price;
    private YesNo isActive;
    private LocalDateTime createdAt;
}
