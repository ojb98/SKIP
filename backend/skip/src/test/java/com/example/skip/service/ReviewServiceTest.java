package com.example.skip.service;

import com.example.skip.dto.ReviewDTO;
import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;
import com.example.skip.dto.projection.ReviewListDTO;
import com.example.skip.entity.Reservation;
import com.example.skip.repository.ReservationRepository;
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
import java.util.List;

@SpringBootTest
@Transactional
@Commit
public class ReviewServiceTest {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    void createReviewTest(){
        Long reserveId = 15L;
        Long userId = 2L;
        String imagePath = null;

        ReviewRequestDTO reviewRequestDTO = ReviewRequestDTO.builder()
                .rating(5)
                .content("리뷰서비스 테스트 입니다.")
                .build();

        ReviewResponseDTO reviewResponseDTO = reviewService.createReview(reserveId, userId, reviewRequestDTO, imagePath);

        Assertions.assertNotNull(reviewResponseDTO.getReviewId(), "리뷰 ID가 null이 아니어야 합니다.");

    }

    @Test
    void testGetReviewListByItem_latest() {
        Long itemId = 4L;
        String sortType = "latest";
        Pageable pageable = PageRequest.of(0, 5); // 0페이지, 5개

        Page<ReviewListDTO> page = reviewService.getReviewListByItem(itemId, sortType, pageable);

        Assertions.assertNotNull(page);
        List<ReviewListDTO> content = page.getContent();

        for (ReviewListDTO r : content) {
            System.out.println("리뷰ID: " + r.getReviewId() +
                    ", 유저이미지: " + r.getUserImage() +
                    ", 아이디: " + r.getUsername() +
                    ", 평점: " + r.getRating() +
                    ", 작성자: " + r.getUsername() +
                    ", 아이템: " + r.getItemName() +
                    ", 사이즈: " + r.getSize() +
                    ", 리뷰이미지: " + r.getImage() +
                    ", 작성일: " + r.getCreatedAt());
        }
    }

}
