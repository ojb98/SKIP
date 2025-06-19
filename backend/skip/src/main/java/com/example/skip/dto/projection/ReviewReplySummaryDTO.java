package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface ReviewReplySummaryDTO {
    Long getReplyId();
    Long getReviewId();
    Long getUserId();
    String getUsername();
    String getContent();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
}
