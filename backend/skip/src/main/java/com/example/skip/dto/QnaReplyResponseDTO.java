package com.example.skip.dto;

import com.example.skip.entity.QnaReply;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QnaReplyResponseDTO {
    private Long replyId;
    private Long qnaId;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QnaReplyResponseDTO(QnaReply qnaReply) {
        this.replyId = qnaReply.getReplyId();
        this.qnaId = qnaReply.getQna().getQnaId();
        this.userId = qnaReply.getUser().getUserId();
        this.content = qnaReply.getContent();
        this.createdAt = qnaReply.getCreatedAt();
        this.updatedAt = qnaReply.getUpdatedAt();
    }
}
