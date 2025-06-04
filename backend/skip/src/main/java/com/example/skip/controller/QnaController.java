package com.example.skip.controller;

import com.example.skip.dto.QnaDTO;
import com.example.skip.dto.QnaRequestDTO;
import com.example.skip.dto.projection.QnaListDTO;
import com.example.skip.enumeration.QnaStatus;
import com.example.skip.service.QnaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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

    // Q&A 조회 (아이템 페이지)
    @GetMapping("/item/{itemId}")
    public Page<QnaListDTO> getQnaListByItem(@PathVariable Long itemId,
                                             @RequestParam(required = false) QnaStatus status,
                                             @RequestParam(required = false) Boolean secret,
                                             Pageable pageable) {

        return qnaService.getQnaListByItem(itemId, status, secret, pageable);
    }

    // Q&A 조회 (마이페이지)
    @GetMapping("/user/{userId}")
    public Page<QnaListDTO> getQnaListByUser(@PathVariable Long userId,
                                             @RequestParam(required = false) QnaStatus status,
                                             @RequestParam(required = false) Boolean secret,
                                             Pageable pageable) {
        return qnaService.getQnaListByUser(userId, status, secret, pageable);
    }

    // Q&A 조회 (관리자 페이지)
    @GetMapping("/admin/rent/{rentId}")
    public Page<QnaListDTO> getQnaListByRent(@PathVariable Long rentId,
                                             @RequestParam(required = false) QnaStatus status,
                                             @RequestParam(required = false) String username,
                                             @RequestParam(required = false) String itemName,
                                             @RequestParam(required = false) Boolean secret,
                                             Pageable pageable){
        return qnaService.getQnaListByRent(rentId, status, username, itemName, secret, pageable);
    }
}
