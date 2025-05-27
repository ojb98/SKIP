package com.example.skip.controller;

import com.example.skip.dto.ReviewDTO;
import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;
    // 리뷰 작성
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewDTO> writeReview(@ModelAttribute ReviewRequestDTO dto,
                                                 @RequestParam Long userId) throws AccessDeniedException {
        ReviewDTO result = reviewService.writeReview(dto, userId);
        return ResponseEntity.ok(result);
    }

    // 리뷰 수정
    @PutMapping(value = "/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long reviewId,
                                                  @ModelAttribute ReviewRequestDTO dto,
                                                  @RequestParam Long userId) throws AccessDeniedException {
        ReviewDTO result = reviewService.updateReview(reviewId, dto, userId);
        return ResponseEntity.ok(result);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId,
                                             @RequestParam Long userId) throws AccessDeniedException {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }

    // 내가 쓴 리뷰 목록 조회 (마이페이지)
    @GetMapping("/user")
    public ResponseEntity<Page<ReviewDTO>> getUserReviews(@RequestParam Long userId,
                                                          Pageable pageable) {
        Page<ReviewDTO> result = reviewService.getUserReviews(userId, pageable);
        return ResponseEntity.ok(result);
    }

    // 렌탈샵 리뷰 목록 조회
    @GetMapping("/rental")
    public ResponseEntity<Page<ReviewDTO>> getRentalReviews(@RequestParam Long rentId,
                                                            Pageable pageable) {
        Page<ReviewDTO> result = reviewService.getRentalReviews(rentId, pageable);
        return ResponseEntity.ok(result);
    }
}
