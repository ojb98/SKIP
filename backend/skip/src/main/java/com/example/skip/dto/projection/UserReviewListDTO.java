package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface UserReviewListDTO {
    //리뷰 정보
    Long getReviewId();
    Long getRentItemId();
    int getRating();
    String getContent();
    String getImage();
    LocalDateTime getCreatedAt();

    Long getRentId();
    Long getItemId();
    String getItemName();
    String getItemImage();
    String getSize();

    // 답변 정보
    Long getReplyId();
    String getReplyContent();
    LocalDateTime getReplyCreatedAt();
}
