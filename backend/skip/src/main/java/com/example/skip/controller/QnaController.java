package com.example.skip.controller;

import com.example.skip.dto.QnaDTO;
import com.example.skip.dto.QnaRequestDTO;
import com.example.skip.dto.projection.QnaListDTO;
import com.example.skip.dto.projection.QnaWithReplyDTO;
import com.example.skip.enumeration.QnaStatus;
import com.example.skip.service.QnaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
@CrossOrigin("*")
public class QnaController {

    private final QnaService qnaService;

    // Q&A 등록
    @PostMapping
    public QnaDTO createQna(@Valid
                            @RequestBody QnaRequestDTO dto,
                            @RequestParam Long userId) {
        return qnaService.createQna(dto, userId);
    }

    // Q&A 수정
    @PutMapping("/{qnaId}")
    public QnaDTO updateQna(@Valid
                            @PathVariable Long qnaId,
                            @RequestBody QnaRequestDTO dto,
                            @RequestParam Long userId) {
        return qnaService.updateQna(qnaId, dto, userId);
    }

    // Q&A 삭제 (사용자)
    @DeleteMapping("/{qnaId}")
    public void deleteQnaByUser(@PathVariable Long qnaId,
                                @RequestParam Long userId) {
        qnaService.deleteQnaByUser(qnaId, userId);
    }

    // Q&A 삭제 (관리자)
    @DeleteMapping("/admin/{qnaId}")
    public void deleteQnaByAdmin(@PathVariable Long qnaId,
                                 @RequestParam Long rentId) {
        qnaService.deleteQnaByAdmin(qnaId, rentId);
    }

    // Q&A 조회 (관리자 페이지)
    @GetMapping("/admin/rent/{rentId}")
    public Page<QnaListDTO> getQnaListByRent(@PathVariable Long rentId,
                                             @RequestParam(required = false) QnaStatus status,
                                             @RequestParam(required = false) String username,
                                             @RequestParam(required = false) String itemName,
                                             @RequestParam(required = false) Boolean secret,
                                             @RequestParam(required = false) Boolean hasReply,
                                             Pageable pageable){
        return qnaService.getQnaListByRent(rentId, status, username, itemName, secret, hasReply, pageable);
    }

    // Q&A 관리자페이지 미답변 수 조회
    @GetMapping("/admin/rent/{rentId}/unansweredCount")
    public ResponseEntity<Long> getUnansweredCount(@PathVariable Long rentId) {
        long count = qnaService.getUnansweredCountByRentId(rentId);
        return ResponseEntity.ok(count);
    }

    // Q&A 조회 (마이페이지) Projection
    @GetMapping("/user")
    public Page<QnaWithReplyDTO> getMyQnaList(@RequestParam Long userId,
                                              @RequestParam(required = false) Boolean hasReply, // true: 답변, false: 미답변, null: 전체
                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                                              Pageable pageable) {
        return qnaService.getQnaWithReplyByUserId(userId, hasReply, startDate, pageable);
    }

    // Q&A 조회 (아이템 페이지) Projection
    @GetMapping("item/{itemId}")
    public Page<QnaWithReplyDTO> getQnaListByItem(@PathVariable Long itemId,
                                                  @RequestParam(required = false) Boolean hasReply,
                                                  @RequestParam(required = false) QnaStatus status,
                                                  @RequestParam(required = false) Boolean secret,
                                                  @RequestParam(required = false) Long currentUserId,
                                                  Pageable pageable){
        return qnaService.getQnaWithReplyByItemId(itemId, hasReply, status, secret, currentUserId, pageable);
    }

    // Q&A 단건 조회
    @GetMapping("/{qnaId}")
    public QnaWithReplyDTO getQnaDetail(@PathVariable Long qnaId) {
        return qnaService.getQnaDetail(qnaId);
    }
}
