package com.example.skip.dto.projection;

import com.example.skip.enumeration.QnaStatus;

import java.time.LocalDateTime;

public interface QnaListDTO {
    Long getQnaId();
    String getTitle();
    String getContent();
    String getUsername(); // from User
    String getItemName(); // from Item
    Boolean getSecret();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
}
