package com.example.skip.controller;

import com.example.skip.dto.QnaReplyRequestDTO;
import com.example.skip.dto.QnaReplyResponseDTO;
import com.example.skip.dto.projection.QnaReplySummaryDTO;
import com.example.skip.service.QnaReplyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qna/reply")
@RequiredArgsConstructor
public class QnaReplyController {

    private final QnaReplyService qnaReplyService;

    // 저장
    @PostMapping
    public ResponseEntity<Long> createReply(@Valid
                                            @RequestBody QnaReplyRequestDTO dto) {
        Long replyId = qnaReplyService.saveReply(dto);
        return ResponseEntity.ok(replyId);
    }

    // 조회(수정, 삭제)
    @GetMapping("/{qnaId}")
    public ResponseEntity<QnaReplyResponseDTO> getReply(@Valid
                                                        @PathVariable Long qnaId) {
        QnaReplyResponseDTO dto = qnaReplyService.getReply(qnaId);
        return ResponseEntity.ok(dto);
    }

    // 조회(화면)
    @GetMapping("/{qnaId}/summary")
    public ResponseEntity<QnaReplySummaryDTO> getReplySummary(@PathVariable Long qnaId) {
        QnaReplySummaryDTO summaryDTO = qnaReplyService.getReplySummary(qnaId);
        return ResponseEntity.ok(summaryDTO);
    }

    // 수정
    @PutMapping("/{qnaId}")
    public ResponseEntity<Void> updateReply(@PathVariable Long qnaId,
                                            @RequestBody String updatedContent) {
        qnaReplyService.updateReply(qnaId, updatedContent);
        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("{qnaId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long qnaId) {
        qnaReplyService.deleteReply(qnaId);
        return ResponseEntity.noContent().build();
    }
}
