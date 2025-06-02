package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QnaRequestDTO {
    private Long itemId;
    private String title;
    private String content;
    private boolean secret;
}
