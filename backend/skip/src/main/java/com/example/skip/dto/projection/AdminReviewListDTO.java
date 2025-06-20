package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface AdminReviewListDTO {
    // 리뷰 정보
    Long getReviewId();
    Long getRentItemId();
    int getRating();
    String getContent();
    String getImage();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();

    String getUsername();
    String getItemName();
    String getSize();

    // 답변 정보
    Long getReplyId();
    Long getReplyUserId();
    String getReplyContent();
    LocalDateTime getReplyCreatedAt();
    LocalDateTime getReplyUpdatedAt();
    String getAdminUsername();
}
