package com.example.skip.dto;

import com.example.skip.entity.Reservation;
import com.example.skip.entity.Review;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReviewRequestDTO {
    private Long reserveId;
    private int rating;
    private String content;

    public Review toEntity(Reservation reservation, String imagePath) {
        return Review.builder()
                .reservation(reservation)
                .rating(rating)
                .content(content)
                .image(imagePath)
                .build();
    }
}
