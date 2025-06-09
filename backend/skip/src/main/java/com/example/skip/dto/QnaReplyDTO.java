package com.example.skip.dto;

import com.example.skip.entity.Qna;
import com.example.skip.entity.QnaReply;
import com.example.skip.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QnaReplyDTO {
    private Long replyId;
    private Long qnaId;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QnaReplyDTO(QnaReply qnaReply) {
        this.replyId = qnaReply.getReplyId();
        this.qnaId = qnaReply.getQna().getQnaId();
        this.userId = qnaReply.getUser().getUserId();
        this.content = qnaReply.getContent();
        this.createdAt = qnaReply.getCreatedAt();
        this.updatedAt = qnaReply.getUpdatedAt();
    }

    public QnaReply toEntity(Qna qna, User user) {
        QnaReply qnaReply = QnaReply.builder()
                            .replyId(replyId)
                            .qna(qna)
                            .user(user)
                            .content(content)
                            .build();
                    return qnaReply;
    }
}
