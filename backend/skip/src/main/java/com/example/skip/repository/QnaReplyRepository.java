package com.example.skip.repository;

import com.example.skip.dto.projection.QnaReplySummaryDTO;
import com.example.skip.entity.QnaReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface QnaReplyRepository extends JpaRepository<QnaReply, Long > {
    @Query("""
        SELECT 
            r.replyId AS replyId,
            r.qna.qnaId AS qnaId,
            r.user.username AS username,
            r.content AS content,
            r.createdAt AS createdAt,
            r.updatedAt AS updatedAt
        FROM QnaReply r
        WHERE r.qna.qnaId =:qnaId
    """)
    Optional<QnaReplySummaryDTO> findByQnaId(@Param("qnaId") Long qnaId);

    // 수정, 삭제용 단건 조회
    Optional<QnaReply> findByQna_QnaId(Long qnaId);

    // 답변 존재 여부 확인용
    boolean existsByQna_QnaId(Long qnaId);
}
