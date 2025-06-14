package com.example.skip.service;


import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;
import com.example.skip.dto.projection.AdminReviewListDTO;
import com.example.skip.dto.projection.ReviewListDTO;
import com.example.skip.dto.projection.ReviewStatsDTO;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.Review;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.ReservationRepository;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.util.FileUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final FileUtil fileUtil;

    private final String subDir = "review";

    // 리뷰 작성
    public ReviewResponseDTO createReview(Long reserveId, Long userId, ReviewRequestDTO dto, String imagePath) {
        Reservation reservation = reservationRepository.findById(reserveId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        if(!reservation.getUser().getUserId().equals(userId)) {
            throw new SecurityException("본인의 예약에 대해서만 리뷰를 작성할 수 있습니다.");
        }

        if(reservation.getStatus() != ReservationStatus.RETURNED) {
            throw new IllegalStateException("반납 완료된 예약에 대해서만 리뷰를 작설할 수 있습니다.");
        }

        Review review = dto.toEntity(reservation, imagePath);
        Review savedReview = reviewRepository.save(review);

        return ReviewResponseDTO.builder()
                .reviewId(savedReview.getReviewId())
                .rating(savedReview.getRating())
                .content(savedReview.getContent())
                .imageUrl(savedReview.getImage())
                .createdAt(savedReview.getCreatedAt())
                .build();
    }


    // 리뷰 수정


    // 리뷰 삭제


    // 리뷰 목록

    // 아이템페이지 리뷰 리스트
    public Page<ReviewListDTO> getReviewListByItem(Long itemId, String sortType, Pageable pageable) {
        Sort sort = switch (sortType) {
            case "highRating" -> Sort.by(Sort.Direction.DESC, "rating");
            case "lowRating" -> Sort.by(Sort.Direction.ASC, "rating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return reviewRepository.findByItemId(itemId, sortedPageable);
    }

    // 관리자페이지 리뷰 리스트
    public Page<AdminReviewListDTO> getReviewWithReplyForAdmin(String username, String itemName, Boolean hasReply, Pageable pageable) {
        return reviewRepository.findAllReviewWithReplyForAdmin(username, itemName, hasReply, pageable);
    }

    // 총 리뷰 수, 평균
    public ReviewStatsDTO getReviewStats(Long itemId){
        return reviewRepository.getReviewsStatsByItemId(itemId);
    }

}
