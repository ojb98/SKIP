package com.example.skip.dto.projection;

import java.time.LocalDateTime;

public interface QnaWithReplyDTO {
    // Qna
    Long getQnaId();                // 문의 ID
    String getTitle();              // 문의 제목
    String getContent();            // 문의 내용
    String getUsername();           // 유저 아이디   (from User)
    String getRentId();             // 렌트 아이디   (from Rent)
    String getItemId();             // 아이템 아이디 (from Item)
    String getItemName();           // 아이템 이름   (from Item)
    String getItemImage();          // 아이템 이미지 (from Item)
    Boolean getSecret();            // 비공개 여부
    LocalDateTime getCreatedAt();   // 글 작성일
    LocalDateTime getUpdatedAt();   // 글 수정일

    // Reply
    Long getReplyId();                  // 답변 ID
    String getReplyContent();            // 답변 내용
    String getReplyUsername();          // 관리자 아이디
    LocalDateTime getReplyCreatedAt();  // 답변 생성일
    LocalDateTime getReplyUpdatedAt();  // 답변 수정일
}
