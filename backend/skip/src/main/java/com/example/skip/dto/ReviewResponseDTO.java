package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReviewResponseDTO {
    private Long reviewId;
    private int rating;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 예약 아이템 정보
    private String itemName;
    private String size;
    private LocalDateTime rentStartDate;
    private LocalDateTime rentEndDate;

}
