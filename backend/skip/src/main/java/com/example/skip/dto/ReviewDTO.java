package com.example.skip.dto;

import com.example.skip.entity.Reservations;
import com.example.skip.entity.Review;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ReviewDTO {
    private Long reviewId;
    private Long reserveId;
    private int rating;
    private String content;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReviewDTO(Review review) {
        this.reviewId = review.getReviewId();
        this.reserveId = review.getReservations().getReserveId();
        this.rating = review.getRating();
        this.content = review.getContent();
        this.image = review.getImage();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
    public Review toEntity(Reservations reservations) {
        Review review = Review.builder()
                .reviewId(reviewId)
                .reservations(reservations)
                .rating(rating)
                .content(content)
                .image(image)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
        return review;
    }
}
