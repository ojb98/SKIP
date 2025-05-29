package com.example.skip.service;

import com.example.skip.dto.ReviewDTO;
import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.annotation.Commit;

import java.nio.file.AccessDeniedException;

@SpringBootTest
@Transactional
@Commit
public class ReviewServiceTest {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    public void write() throws AccessDeniedException {

        ReviewRequestDTO dto = new ReviewRequestDTO();
        dto.setReserveId(1L);
        dto.setRating(3);
        dto.setContent("테스트 리뷰 작성7");
        dto.setImageFile(null);

        ReviewDTO rDto =  reviewService.writeReview(dto, 1L);

        System.out.println("<< 작성 리뷰 >>");
        System.out.println(rDto);

        Assertions.assertEquals(1L, rDto.getReserveId());
    }

    @Test
    public void update() throws AccessDeniedException {
        Long reviewId = 15L;
        Long userId = 1L;

        ReviewRequestDTO dto = new ReviewRequestDTO();
        dto.setReserveId(1L);
        dto.setRating(5);
        dto.setContent("서비스 리뷰 수정 테스트");
        dto.setImageFile(null);

        ReviewDTO updatedReview = reviewService.updateReview(reviewId, dto, userId);

        Assertions.assertEquals(5, updatedReview.getRating());

        System.out.println("수정된 리뷰:" + updatedReview);
    }

    @Test
    public void delete() throws AccessDeniedException {
        Long reviewId = 15L;
        Long userId = 1L;

        reviewService.deleteReview(reviewId, userId);

        boolean exists = reviewRepository.findById(reviewId).isPresent();
        Assertions.assertFalse(exists);

        System.out.println("삭제 완료");
    }

    @Test
    public void getUserReviews() {
        Long userId = 9L;
        Pageable pageable = PageRequest.of(0,10);

        Page<ReviewDTO> reviewPage = reviewService.getUserReviews(userId, pageable);

        Assertions.assertNotNull(reviewPage);
        Assertions.assertFalse(reviewPage.isEmpty(), "리뷰 목록이 비어있습니다.");

        System.out.println("<< 내가 쓴 리뷰 목록 >>");
        reviewPage.getContent().forEach(System.out::println);
    }

    @Test
    public void getRentalReivews() {
        Long rentId = 2L;
        Pageable pageable = PageRequest.of(0,10);

        Page<ReviewDTO> reviewPage = reviewService.getRentalReviews(rentId, pageable);

        Assertions.assertNotNull(reviewPage);

        System.out.println("<<" + rentId +  "번 렌탈샵 리뷰 목록 >>");
        Assertions.assertFalse(reviewPage.isEmpty(), "리뷰 목록이 비어있습니다.");
        reviewPage.getContent().forEach(System.out::println);
    }

}
