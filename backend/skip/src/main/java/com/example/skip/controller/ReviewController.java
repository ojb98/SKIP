package com.example.skip.controller;

import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;
import com.example.skip.dto.UserDto;
import com.example.skip.dto.projection.*;
import com.example.skip.dto.projection.AdminReviewListDTO;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.service.ReviewService;
import com.example.skip.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final FileUploadUtil fileUploadUtil;

    // 리뷰 작성 페이지
    @GetMapping("/info/{rentItemId}")
    public ResponseEntity<ReviewWriteDTO> getReviewWriteInfo(@PathVariable Long rentItemId,
                                                             @AuthenticationPrincipal UserDto userDto) {
        ReviewWriteDTO reviewWriteDTO = reviewService.getReviewWriteInfo(rentItemId, userDto.getUserId());
        return ResponseEntity.ok(reviewWriteDTO);
    }

    // 리뷰 작성
    @PostMapping(value = "/{rentItemId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewResponseDTO> createReview(@PathVariable Long rentItemId,
                                                          @RequestPart("review")ReviewRequestDTO reviewRequestDTO,
                                                          @RequestPart(value = "image", required = false)MultipartFile imageFile,
                                                          @AuthenticationPrincipal UserDto userDto){
        // 이미지 업로드 (없으면 null로 처리)
        String imagePath = fileUploadUtil.uploadFileAndUpdateUrl(imageFile, null, "review");

        // 리뷰 저장
        ReviewResponseDTO responseDTO = reviewService.createReview(
                rentItemId,
                userDto.getUserId(),
                reviewRequestDTO,
                imagePath
        );
        return ResponseEntity.ok(responseDTO);
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable("reviewId") Long reviewId,
                                               @RequestParam("rating") int rating,
                                               @RequestParam("content") String content,
                                               @RequestParam(value = "image", required = false) MultipartFile imageFile,
                                               @RequestParam(value = "deleteImage", defaultValue = "false") boolean deleteImage) {

        System.out.println("rating = " + rating);
        System.out.println("content = " + content);
        System.out.println("deleteImage = " + deleteImage);
        System.out.println("imageFile = " + (imageFile != null ? imageFile.getOriginalFilename() : "없음"));

        try {
            reviewService.updateReview(reviewId, rating, content, imageFile, deleteImage);
            return ResponseEntity.ok("리뷰가 수정되었습니다.");
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 수정 중 오류가 발생했습니다.");
        }
    }

    // 마이페이지 리뷰 삭제
    @DeleteMapping("/mypage/delete/{reviewId}")
    public ResponseEntity<String> deleteReviewFromMyPage(@PathVariable Long reviewId,
                                                         @AuthenticationPrincipal UserDto userDto) {
        try {
            reviewService.deleteReviewByUser(reviewId, userDto.getUserId());
            return ResponseEntity.ok("리뷰가 삭제되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("본인의 리뷰만 삭제 가능합니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 리뷰가 존재하지 않습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 삭제 중 오류가 발생했습니다.");
        }
    }

    // 관리자 페이지 리뷰 삭제
    @DeleteMapping("/admin/delete/{reviewId}")
    public ResponseEntity<Void> deleteReviewByAdmin(@PathVariable Long reviewId,
                                                    @AuthenticationPrincipal UserDto userDto) {
        reviewService.deleteReviewByAdmin(reviewId);
        return ResponseEntity.noContent().build();
    }


    // 리뷰 리스트
    // 아이템페이지 리뷰 목록
    @GetMapping("/item/{itemId}")
    public ResponseEntity<Page<ReviewListDTO>> getReviewListByitem(
            @PathVariable Long itemId,
            @RequestParam(defaultValue = "recent") String sort,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<ReviewListDTO> result = reviewService.getReviewListByItem(itemId, sort, pageable);
        return ResponseEntity.ok(result);
    }

    // 총 리뷰 수, 평균
    @GetMapping("/stats/{itemId}")
    public ResponseEntity<ReviewStatsDTO> getReviewStats(@PathVariable Long itemId) {
        ReviewStatsDTO stats = reviewService.getReviewStats(itemId);
        return ResponseEntity.ok(stats);
    }

    // 관리자페이지 리뷰 목록
    @GetMapping("/admin")
    public ResponseEntity<Page<AdminReviewListDTO>> getReviewWithReplyList(@RequestParam Long rentId,
                                                                           @RequestParam(required = false) String username,
                                                                           @RequestParam(required = false) String itemName,
                                                                           @RequestParam(required = false) Boolean hasReply,
                                                                           Pageable pageable) {
        Page<AdminReviewListDTO> result = reviewService.getReviewWithReplyForAdmin(rentId, username, itemName, hasReply, pageable);
        return ResponseEntity.ok(result);
    }

    // 마이페이지 리뷰 목록
    @GetMapping("/mypage")
    public Page<UserReviewListDTO> getUserReviewList(@AuthenticationPrincipal UserDto userDto,
                                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime startDate,
                                                     @PageableDefault(size = 5) Pageable pageable) {

        return reviewService.getUserReviewList(userDto.getUserId(), startDate, pageable);
    }

    // 리뷰 단건 조회(수정용)
    @GetMapping("/updateInfo/{reviewId}")
    public ResponseEntity<ReviewUpdateDTO> getReviewForUpdate(@PathVariable Long reviewId) {
        ReviewUpdateDTO reviewUpdateDTO = reviewService.getReviewUpdateInfo(reviewId);
        return ResponseEntity.ok(reviewUpdateDTO);
    }

}
