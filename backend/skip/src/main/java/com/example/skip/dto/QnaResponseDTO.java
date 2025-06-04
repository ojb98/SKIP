package com.example.skip.dto;

import com.example.skip.entity.Qna;
import com.example.skip.enumeration.QnaStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QnaResponseDTO {
    private Long qnaId;
    private String title;
    private String content;
    private String username;
    private String itemName;
    private QnaStatus status;
    private boolean secret;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QnaResponseDTO(Qna qna) {
        this.qnaId = qna.getQnaId();
        this.title = qna.getTitle();
        this.content = qna.getContent();
        this.username = qna.getUser().getUsername();
        this.itemName = qna.getItem().getName();
        this.status = qna.getStatus();
        this.secret = qna.isSecret();
        this.createdAt = qna.getCreatedAt();
        this.updatedAt = qna.getUpdatedAt();
    }
}
