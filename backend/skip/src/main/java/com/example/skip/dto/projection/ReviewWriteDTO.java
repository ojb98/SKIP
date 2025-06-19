package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface ReviewWriteDTO {
    Long getRentItemId();
    String getItemName();
    String getItemImage();
    String getSize();
    LocalDateTime getRentStart();
    LocalDateTime getRentEnd();
}
