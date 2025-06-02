package com.example.skip.service;

import com.example.skip.dto.QnaDTO;
import com.example.skip.dto.QnaRequestDTO;
import com.example.skip.dto.projection.QnaListDTO;
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
import org.springframework.test.annotation.Commit;

@SpringBootTest
@Transactional
@Commit
public class QnaServiceTest {

    @Autowired
    private QnaService qnaService;

    Long userId = 1L;
    Long itemId = 5L;
    Long rentId = 2L;
    
    // qna 등록
    @Test
    public void qnaInsertTest() {

        for (int i = 0; i <= 10; i++) {
            QnaRequestDTO qnaRequestDTO = QnaRequestDTO.builder()
                    .itemId(itemId)
                    .title("qna 테스트 제목" + i)
                    .content("qna 테스트 내용" + i)
                    .secret(false)
                    .build();

            QnaDTO qnaDTO = qnaService.createQna(qnaRequestDTO, userId);

            System.out.println("등록된 Q&A: " + qnaDTO);
            Assertions.assertNotNull(qnaDTO.getQnaId());
            Assertions.assertEquals(1L, qnaDTO.getUserId());
        }
    }

    // qna 수정
    @Test
    public void qnaUpdateTest() {
        QnaRequestDTO qnaRequestDTO = QnaRequestDTO.builder()
                .itemId(itemId)
                .title("제목 수정 테스트")
                .content("내용 수정 테스트")
                .secret(true)
                .build();

        QnaDTO qnaDTO = qnaService.updateQna(1L, qnaRequestDTO, userId);

        System.out.println("수정된 Q&A: " + qnaDTO);
        Assertions.assertEquals(1L, qnaDTO.getQnaId());
    }

    // qna 삭제
    // 사용자
    @Test
    public void qnaUserDeleteTest() {
        qnaService.deleteQnaByUser(2L, userId);
    }
    // 관리자
    @Test
    public void qnaAdminDeleteTest() {
        qnaService.deleteQnaByAdmin(3L, rentId);
    }

    // 조회
    // 렌탈샵 페이지 조회
    @Test
    public void qnaListByItemTest() {
        Pageable pageable = PageRequest.of(0,10);
        Page<QnaListDTO> list = qnaService.getQnaListByItem(itemId, null, null, pageable);

        Assertions.assertFalse(list.isEmpty());
        list.forEach(System.out::println);
        list.forEach(qna -> System.out.println("qnaId:" + qna.getQnaId() + "제목: " + qna.getTitle() + "내용: " + qna.getContent()));
    }

    // 마이페이지 조회
    @Test
    public void qnaListByUserTest() {
        Pageable pageable = PageRequest.of(0,10);
        Page<QnaListDTO> list = qnaService.getQnaListByUser(userId, null, null, pageable);

        Assertions.assertFalse(list.isEmpty());
        list.forEach(System.out::println);
    }

    // 관리자페이지 조회
    @Test
    public void qnaListByAdminTest() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<QnaListDTO> list = qnaService.getQnaListByRent(rentId, null, null, null, pageable);

        Assertions.assertFalse(list.isEmpty());
        list.forEach(System.out::println);
    }
}
