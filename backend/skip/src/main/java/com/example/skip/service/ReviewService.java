package com.example.skip.service;

import com.example.skip.dto.ReviewDTO;
import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.Review;
import com.example.skip.entity.User;
import com.example.skip.repository.ReservationsRepository;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.util.FileUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ReservationsRepository reservationsRepository;
    private final FileUtil fileUtil;

    private final String subDir = "review";

    // 리뷰 작성
    public ReviewDTO writeReview(ReviewRequestDTO dto, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
        Reservation reservations = reservationsRepository.findById(dto.getReserveId()).orElseThrow(() -> new IllegalArgumentException("예약이 존재하지 않습니다."));

        if (!reservations.getUser().getUserId().equals(userId)){
            throw new AccessDeniedException("본인이 예약한 리뷰만 작성할 수 있습니다.");
        }

        String imagePath = fileUtil.uploadFile(dto.getImageFile(), subDir);

        Review review = Review.builder()
                .reservation(reservations)
                .rating(dto.getRating())
                .content(dto.getContent())
                .image(imagePath)
                .build();

        Review saveReview = reviewRepository.save(review);
        return new ReviewDTO(saveReview);
    }

    // 리뷰 수정
    public ReviewDTO updateReview(Long reviewId, ReviewRequestDTO dto, Long userId) throws AccessDeniedException {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("리뷰가 존재하지 않습니다."));

        if(!review.getReservation().getUser().getUserId().equals(userId)){
            throw new AccessDeniedException("수정 권한이 없습니다.");
        }

        review.setRating(dto.getRating());
        review.setContent(dto.getContent());

        MultipartFile newImage = dto.getImageFile();
        if(newImage != null && !newImage.isEmpty()) {
            if(review.getImage() != null) {
                fileUtil.deleteFile(review.getImage());
            }
            String newImagePath = fileUtil.uploadFile(newImage, subDir);
            review.setImage(newImagePath);
        }
        return new ReviewDTO(review);
    }

    // 리뷰 삭제
    public void deleteReview(Long reviewId, Long userId) throws AccessDeniedException {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("리뷰가 존재하지 않습니다."));

        if(!review.getReservation().getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }

        if(review.getImage() != null) {
            fileUtil.deleteFile(review.getImage());
        }
        reviewRepository.delete(review);
    }

    // 리뷰 목록
    // 본인 리뷰 목록 조회 (개인 회원 마이페이지)
    public Page<ReviewDTO> getUserReviews(Long userId, Pageable pageable) {
        return reviewRepository.findAllByReservation_User_UserId(userId, pageable)
                .map(ReviewDTO::new);
    }
    // 렌탈샵 리뷰 목록 조회 (렌탈샵 마이페이지)
    public Page<ReviewDTO> getRentalReviews(Long rentId, Pageable pageable) {
        return reviewRepository.findAllByReservation_Rent_RentId(rentId, pageable)
                .map(ReviewDTO::new);
    }

}
