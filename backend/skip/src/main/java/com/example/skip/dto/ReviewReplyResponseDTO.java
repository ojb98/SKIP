package com.example.skip.dto;

import com.example.skip.entity.ReviewReply;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReviewReplyResponseDTO {

    private Long replyId;
    private Long reviewId;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReviewReplyResponseDTO fromEntity(ReviewReply reviewReply) {
        return ReviewReplyResponseDTO.builder()
                .replyId(reviewReply.getReplyId())
                .reviewId(reviewReply.getReview().getReviewId())
                .userId(reviewReply.getUser().getUserId())
                .content(reviewReply.getContent())
                .createdAt(reviewReply.getCreatedAt())
                .updatedAt(reviewReply.getUpdatedAt())
                .build();
    }
}
