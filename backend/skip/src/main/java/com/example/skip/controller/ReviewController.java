package com.example.skip.controller;

import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;
import com.example.skip.dto.UserDto;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.service.ReviewService;
import com.example.skip.util.FileUploadUtil;
import jakarta.mail.Multipart;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final FileUploadUtil fileUploadUtil;

    // 리뷰 작성
    @PostMapping(value = "/{reserveId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewResponseDTO> createReview(@PathVariable Long rentItemId,
                                                          @RequestPart("review")ReviewRequestDTO reviewRequestDTO,
                                                          @RequestPart(value = "image", required = false)MultipartFile imageFile,
                                                          //@RequestParam Long userId,
                                                          @AuthenticationPrincipal UserDto userDto){
        System.out.println("UserDto:" + userDto);

        // 이미지 업로드
        String imagePath = fileUploadUtil.uploadFileAndUpdateUrl(imageFile, null, "review");

        // 리뷰 저장
        ReviewResponseDTO responseDTO = reviewService.createReview(
                rentItemId,
                //userId,
                userDto.getUserId(),
                reviewRequestDTO,
                imagePath
        );
        return ResponseEntity.ok(responseDTO);
    }

    // 리뷰 수정

    // 리뷰 삭제


    // 리뷰 평점 평균
/*    @GetMapping("/rent/item/average")
    public ResponseEntity<Double> getAverageRating(@RequestParam Long rentId,
                                                   @RequestParam Long itemId) {
        Double avg = reviewRepository.findAverageRating(rentId, itemId);
        return ResponseEntity.ok(avg != null ? avg : 0.0);
    }*/

}
