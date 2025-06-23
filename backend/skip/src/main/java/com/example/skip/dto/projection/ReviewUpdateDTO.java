package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface ReviewUpdateDTO {
    //리뷰 정보
    Long getReviewId();
    int getRating();
    String getContent();
    String getImage();

    // 구매 아이템 정보
    Long getItemId();
    String getItemName();
    String getItemImage();
    String getSize();
    LocalDateTime getRentStart();
    LocalDateTime getRentEnd();

}
