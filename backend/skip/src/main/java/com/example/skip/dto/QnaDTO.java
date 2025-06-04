package com.example.skip.dto;

import com.example.skip.entity.Item;
import com.example.skip.entity.Qna;
import com.example.skip.entity.User;
import com.example.skip.enumeration.QnaStatus;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QnaDTO {
    private Long qnaId;
    private Long userId;
    private Long itemId;
    private String title;
    private String content;
    private QnaStatus status;
    private boolean secret;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QnaDTO(Qna qna) {
        this.qnaId = qna.getQnaId();
        this.userId = qna.getUser().getUserId();
        this.itemId = qna.getItem().getItemId();
        this.title = qna.getTitle();
        this.content = qna.getContent();
        this.status = qna.getStatus();
        this.secret = qna.isSecret();
        this.createdAt = qna.getCreatedAt();
        this.updatedAt = qna.getUpdatedAt();
    }

    public Qna toEntity(User user, Item item) {
        Qna qna = Qna.builder()
                .qnaId(qnaId)
                .user(user)
                .item(item)
                .title(title)
                .content(content)
                .status(status)
                .secret(secret)
                .build();
        return qna;
    }
}
