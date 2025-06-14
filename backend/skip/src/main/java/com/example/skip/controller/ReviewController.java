package com.example.skip.controller;

import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;
import com.example.skip.dto.UserDto;
import com.example.skip.dto.projection.AdminReviewListDTO;
import com.example.skip.dto.projection.ReviewListDTO;
import com.example.skip.dto.projection.ReviewStatsDTO;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.service.ReviewService;
import com.example.skip.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.AccessDeniedException;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final FileUploadUtil fileUploadUtil;

    // 리뷰 작성
    @PostMapping(value = "/api/reviews/{reserveId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewResponseDTO> createReview(@PathVariable Long reserveId,
                                                          @RequestPart("review")ReviewRequestDTO reviewRequestDTO,
                                                          @RequestPart(value = "image", required = false)MultipartFile imageFile,
                                                          @AuthenticationPrincipal UserDto userDto){
        System.out.println("UserDto:" + userDto);

        // 이미지 업로드
        String imagePath = fileUploadUtil.uploadFileAndUpdateUrl(imageFile, null, "review");

        // 리뷰 저장
        ReviewResponseDTO responseDTO = reviewService.createReview(
                reserveId,
                //userId,
                userDto.getUserId(),
                reviewRequestDTO,
                imagePath
        );
        return ResponseEntity.ok(responseDTO);
    }

    // 리뷰 수정

    // 리뷰 삭제


    // 리뷰 리스트
    // 아이템페이지 리뷰 목록
    @GetMapping("/api/review/item/{itemId}")
    public ResponseEntity<Page<ReviewListDTO>> getReviewListByitem(@PathVariable Long itemId,
                                                                   @RequestParam(defaultValue = "recent") String sort,
                                                                   @PageableDefault(size = 10) Pageable pageable) {
        Page<ReviewListDTO> result = reviewService.getReviewListByItem(itemId, sort, pageable);
        return ResponseEntity.ok(result);
    }

    // 관리자페이지 리뷰 목록
    @GetMapping("/api/reviews/admin")
    public Page<AdminReviewListDTO> getReviewWithReplyList(@RequestParam(required = false) String username,
                                                           @RequestParam(required = false) String itemName,
                                                           @RequestParam(required = false) Boolean hasReply,
                                                           @PageableDefault(size = 10) Pageable pageable) {
        return reviewService.getReviewWithReplyForAdmin(username, itemName, hasReply, pageable);
    }



    // 총 리뷰 수, 평균
    @GetMapping("/api/review/stats/{itemId}")
    public ResponseEntity<ReviewStatsDTO> getReviewStats(@PathVariable Long itemId) {
        ReviewStatsDTO stats = reviewService.getReviewStats(itemId);
        return ResponseEntity.ok(stats);
    }


}
