package com.example.skip.dto;

import com.example.skip.entity.Review;
import com.example.skip.entity.ReviewReply;
import com.example.skip.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReviewReplyRequestDTO {

    private Long reviewId;
    private String content;

    public ReviewReply toEntity(Review review, User user) {
        return ReviewReply.builder()
                .review(review)
                .user(user)
                .content(content)
                .build();
    }
}
