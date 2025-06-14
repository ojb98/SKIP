package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface ReviewListDTO {
    // Review
    Long getReviewId();
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
}
