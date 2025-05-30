package com.example.skip.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ReviewListDTO {
    private Long reviewId;
    private String userId;
    private String itemName;
    private String itemSize;
    private int rating;
    private String content;
    private String image;
    private LocalDateTime createdAt;
}
