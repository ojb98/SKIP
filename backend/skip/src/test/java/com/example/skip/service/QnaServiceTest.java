package com.example.skip.service;

import com.example.skip.dto.QnaDTO;
import com.example.skip.dto.QnaRequestDTO;
import com.example.skip.dto.projection.QnaListDTO;
import com.example.skip.dto.projection.QnaWithReplyDTO;
import com.example.skip.entity.Qna;
import com.example.skip.repository.QnaRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;

import java.time.LocalDateTime;

@SpringBootTest
@Transactional
@Commit
public class QnaServiceTest {

    @Autowired
    private QnaService qnaService;

    Long userId = 1L;
    Long itemId = 5L;
    Long rentId = 2L;
    @Autowired
    private QnaRepository qnaRepository;

    // qna 등록
//    @Test
//    public void qnaInsertTest() {
//
//        for (int i = 0; i <= 10; i++) {
//            QnaRequestDTO qnaRequestDTO = QnaRequestDTO.builder()
//                    .itemId(itemId)
//                    .title("qna 테스트 제목" + i)
//                    .content("qna 테스트 내용" + i)
//                    .secret(false)
//                    .build();
//
//            QnaDTO qnaDTO = qnaService.createQna(qnaRequestDTO, userId);
//
//            System.out.println("등록된 Q&A: " + qnaDTO);
//            Assertions.assertNotNull(qnaDTO.getQnaId());
//            Assertions.assertEquals(1L, qnaDTO.getUserId());
//        }
//    }
//
//    // qna 수정
//    @Test
//    public void qnaUpdateTest() {
//        QnaRequestDTO qnaRequestDTO = QnaRequestDTO.builder()
//                .itemId(itemId)
//                .title("제목 수정 테스트")
//                .content("내용 수정 테스트")
//                .secret(true)
//                .build();
//
//        QnaDTO qnaDTO = qnaService.updateQna(1L, qnaRequestDTO, userId);
//
//        System.out.println("수정된 Q&A: " + qnaDTO);
//        Assertions.assertEquals(1L, qnaDTO.getQnaId());
//    }
//
//    // qna 삭제
//    // 사용자
//    @Test
//    public void qnaUserDeleteTest() {
//        qnaService.deleteQnaByUser(2L, userId);
//    }
//    // 관리자
//    @Test
//    public void qnaAdminDeleteTest() {
//        qnaService.deleteQnaByAdmin(3L, rentId);
//    }
//
//    // 조회
//
//    // 마이페이지 조회
//    @Test
//    public void qnaListByUserIdTest() {
//        Pageable pageable = PageRequest.of(0, 5, Sort.by("createdAt").descending());
//
//        Page<QnaWithReplyDTO> result = qnaService.getQnaWithReplyByUserId(1L,null, null, pageable);
//
//        Assertions.assertNotNull(result);
//        Assertions.assertFalse(result.getContent().isEmpty());
//
//        for(QnaWithReplyDTO dto : result.getContent()) {
//            System.out.println("QnaId: " + dto.getQnaId());
//            System.out.println("itemName: " + dto.getItemName());
//            System.out.println("itemImage: " + dto.getItemImage());
//            System.out.println("Title: " + dto.getTitle());
//            System.out.println("content: " + dto.getContent());
//            System.out.println("username: " + dto.getUsername());
//            System.out.println("CreatedAt: " + dto.getCreatedAt());
//            System.out.println("replyContent: " + dto.getReplyContent());
//            System.out.println("replyName: " + dto.getReplyUsername());
//            System.out.println("replyCreatedAt: " + dto.getReplyCreatedAt());
//            System.out.println("----------------------------------------------");
//        }
//    }
//
//    @Test
//    void testDeleteOldQna() {
//        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(3);
//
//        long beforeCount = qnaRepository.count();
//
//        qnaRepository.deleteByCreatedAtBefore(cutoffDate);
//
//        long afterCount = qnaRepository.count();
//
//        Assertions.assertTrue(beforeCount >= afterCount);
//
//    }
}
