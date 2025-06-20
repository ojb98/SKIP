package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface ReviewListDTO {
    // Review
    Long getReviewId();
    Long getRentItemId();
    int getRating();
    String getContent();
    String getImage();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();

    // User
    String getUsername();
    String getUserImage();

    // Item
    String getItemName();

    // ItemDetail
    String getSize();

    // 답변 정보
    Long getReplyId();
    Long getReplyUserId();
    String getReplyAdminUserImage();
    String getReplyContent();
    LocalDateTime getReplyCreatedAt();
    LocalDateTime getReplyUpdatedAt();
    String getAdminUsername();
}
