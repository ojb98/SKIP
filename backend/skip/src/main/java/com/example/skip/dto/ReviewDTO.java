package com.example.skip.dto;

import com.example.skip.entity.Reservation;
import com.example.skip.entity.Review;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReviewDTO {
    private Long reviewId;
    private Long rentItemId;
    private int rating;
    private String content;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReviewDTO(Review review) {
        this.reviewId = review.getReviewId();
        this.rentItemId = review.getReservationItem().getRentItemId();
        this.rating = review.getRating();
        this.content = review.getContent();
        this.image = review.getImage();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
}
