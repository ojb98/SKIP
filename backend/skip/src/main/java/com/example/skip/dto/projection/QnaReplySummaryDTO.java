package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface QnaReplySummaryDTO {
    Long getReplyId();
    Long getQnaId();
    String getUsername();
    String getContent();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
}
