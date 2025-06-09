package com.example.skip.service;

import com.example.skip.dto.QnaReplyDTO;
import com.example.skip.dto.QnaReplyRequestDTO;
import com.example.skip.dto.QnaReplyResponseDTO;
import com.example.skip.dto.projection.QnaReplySummaryDTO;
import com.example.skip.entity.QnaReply;
import com.example.skip.repository.QnaReplyRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

@SpringBootTest
@Transactional
@Commit
public class QnaReplyServiceTest {

    @Autowired
    private QnaReplyService qnaReplyService;
    @Autowired
    private QnaReplyRepository qnaReplyRepository;

    private static Long savedReplyId;

    // 답변 저장
    @Test
    public void saveReplyTest() {
        QnaReplyRequestDTO dto = QnaReplyRequestDTO.builder()
                .qnaId(1L)
                .userId(1L)
                .content("답변 테스트 입니다.")
                .build();

        Long replyId = qnaReplyService.saveReply(dto);
        savedReplyId = replyId;

        System.out.println("QnaId: " + dto.getQnaId());
        Assertions.assertNotNull(replyId);
    }

    // 단건 조회
    @Test
    public void getReplyTest() {
        QnaReplyResponseDTO replyResponseDTO = qnaReplyService.getReply(1L);

        System.out.println("조회결과:" + replyResponseDTO);
        Assertions.assertNotNull(replyResponseDTO);
        Assertions.assertEquals(1L, replyResponseDTO.getQnaId());
    }

    //QnaReplySummary 조회
    @Test
    public void getReplySummaryTest() {
        QnaReplySummaryDTO summaryDTO = qnaReplyService.getReplySummary(1L);

        System.out.println("summaryDTO 조회결과" + summaryDTO);
        Assertions.assertNotNull(summaryDTO);
        Assertions.assertEquals(1L, summaryDTO.getQnaId());
    }

}
