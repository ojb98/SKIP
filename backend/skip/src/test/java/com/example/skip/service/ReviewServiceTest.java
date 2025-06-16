package com.example.skip.service;

import com.example.skip.dto.ReviewDTO;
import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;
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

//    @Test
//    void createReviewTest(){
//        Long reserveId = 15L;
//        Long userId = 2L;
//        String imagePath = null;
//
//        ReviewRequestDTO reviewRequestDTO = ReviewRequestDTO.builder()
//                .rating(5)
//                .content("리뷰서비스 테스트 입니다.")
//                .build();
//
//        ReviewResponseDTO reviewResponseDTO = reviewService.createReview(reserveId, userId, reviewRequestDTO, imagePath);
//
//        Assertions.assertNotNull(reviewResponseDTO.getReviewId(), "리뷰 ID가 null이 아니어야 합니다.");
//
//    }

}
