package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QnaReplyRequestDTO {
    private Long qnaId;
    private Long userId;
    private String content;
}
