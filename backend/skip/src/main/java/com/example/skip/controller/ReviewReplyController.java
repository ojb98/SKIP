package com.example.skip.controller;

import com.example.skip.dto.ReviewReplyRequestDTO;
import com.example.skip.dto.ReviewReplyResponseDTO;
import com.example.skip.dto.UserDto;
import com.example.skip.dto.projection.ReviewReplySummaryDTO;
import com.example.skip.service.ReviewReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews/admin")
public class ReviewReplyController {

    private final ReviewReplyService reviewReplyService;

    // 리뷰 답변 등록
    @PostMapping
    public ResponseEntity<ReviewReplyResponseDTO> save(@RequestBody ReviewReplyRequestDTO dto,
                                                       @AuthenticationPrincipal UserDto userDto) {
        ReviewReplyResponseDTO response = reviewReplyService.saveReviewReply(dto, userDto);
        return ResponseEntity.ok(response);
    }

    // 리뷰 답변 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewReplyResponseDTO> update(@PathVariable Long reviewId,
                                                         @RequestBody ReviewReplyRequestDTO dto,
                                                         @AuthenticationPrincipal UserDto userDto) {
        ReviewReplyResponseDTO response = reviewReplyService.updateReviewReply(reviewId, dto, userDto);
        return ResponseEntity.ok(response);
    }

    // 리뷰 답변 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(@PathVariable Long reviewId,
                                       @AuthenticationPrincipal UserDto userDto) {
        reviewReplyService.deleteReply(reviewId, userDto);
        return ResponseEntity.noContent().build();
    }

    // 리뷰 답변 단건 조회 (수정, 삭제용)
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewReplyResponseDTO> get(@PathVariable Long reviewId,
                                                      @AuthenticationPrincipal UserDto userDto) {
        ReviewReplyResponseDTO response = reviewReplyService.getReplyByReview(reviewId, userDto);
        return ResponseEntity.ok(response);
    }

    // 리뷰 답변 단건 조회 (화면용)
    @GetMapping("/{reviewId}/summary")
    public ResponseEntity<ReviewReplySummaryDTO> getReplySummary(@PathVariable Long reviewId) {
        ReviewReplySummaryDTO reviewReplySummaryDTO = reviewReplyService.getReplySummary(reviewId);
        return ResponseEntity.ok(reviewReplySummaryDTO);
    }
}
