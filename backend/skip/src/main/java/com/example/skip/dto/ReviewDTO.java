package com.example.skip.dto;

import com.example.skip.entity.Reservation;
import com.example.skip.entity.Review;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
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
        this.reserveId = review.getReservation().getReserveId();
        this.rating = review.getRating();
        this.content = review.getContent();
        this.image = review.getImage();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
    public Review toEntity(Reservation reservation) {
        Review review = Review.builder()
                .reviewId(reviewId)
                .reservation(reservation)
                .rating(rating)
                .content(content)
                .image(image)
                .build();
        return review;
    }
}
