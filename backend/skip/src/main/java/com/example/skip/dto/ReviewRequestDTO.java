package com.example.skip.dto;

import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.entity.Review;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReviewRequestDTO {
    private Long rentItemId;
    private int rating;
    private String content;

    public Review toEntity(ReservationItem reservationItem, String imagePath) {
        return Review.builder()
                .reservationItem(reservationItem)
                .rating(rating)
                .content(content)
                .image(imagePath)
                .build();
    }
}
