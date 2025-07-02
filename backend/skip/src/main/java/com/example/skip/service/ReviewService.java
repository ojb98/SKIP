package com.example.skip.service;


import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;

import com.example.skip.dto.projection.*;
import com.example.skip.entity.*;

import com.example.skip.repository.ReviewReplyRepository;
import com.example.skip.repository.ReviewRepository;

import com.example.skip.repository.reservation.ReservationItemRepository;
import com.example.skip.repository.reservation.ReservationRepository;
import com.example.skip.util.FileUtil;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final JPAQueryFactory jpaQueryFactory;
    private final FileUtil fileUtil;

    private static final QReview review = QReview.review;
    private static final QRent rent = QRent.rent;
    private static final QReservation reservation = QReservation.reservation;
    private static final QReservationItem reservationItem = QReservationItem.reservationItem;

    private final ReviewReplyRepository reviewReplyRepository;
    private final ReservationItemRepository reservationItemRepository;

    // 리뷰 작성
    public ReviewResponseDTO createReview(Long rentItemId, Long userId, ReviewRequestDTO dto, String imagePath) {
        // rentItemId로 ReservationItem 조회
        ReservationItem reservationItem = reservationItemRepository.findById(rentItemId)
                .orElseThrow(() -> new IllegalArgumentException("예약 상품 정보를 찾을 수 없습니다."));
        // 본인의 예약인지 확인
        if(!reservationItem.getReservation().getUser().getUserId().equals(userId)) {
            throw new SecurityException("본인의 예약에 대해서만 리뷰를 작성할 수 있습니다.");
        }
        // 해당 예약 아이템이 반납되었는지 확인
        if(!reservationItem.isReturned()) {
            throw new IllegalStateException("반납 완료된 상품에 대해서만 리뷰를 작성할 수 있습니다.");
        }

        // 중복 작성 방지
        if(reservationItem.isReviewed()) {
            throw new IllegalStateException("이미 리뷰가 작성된 예약 상품입니다.");
        }

        Review review = dto.toEntity(reservationItem, imagePath);
        Review savedReview = reviewRepository.save(review);

        // reservationItem의 reviewed true 설정
        reservationItem.setReviewed(true);

        return ReviewResponseDTO.builder()
                .reviewId(savedReview.getReviewId())
                .rating(savedReview.getRating())
                .content(savedReview.getContent())
                .imageUrl(savedReview.getImage())
                .createdAt(savedReview.getCreatedAt())
                .build();
    }

    // 리뷰 작성 화면
    public ReviewWriteDTO getReviewWriteInfo(Long rentItemId, Long userId) {
        return reservationItemRepository.findReviewWriteInfo(rentItemId, userId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰 작성 정보를 찾을 수 없습니다."));
    }


    // 리뷰 수정
    public void updateReview(Long reviewId, int rating, String content, MultipartFile imageFile, boolean deleteImage) throws IOException {
        Review review = reviewRepository.findReviewDetailById(reviewId);

        review.setRating(rating);
        review.setContent(content);

        // 이미지 삭제 요청이 있는 경우
        if(deleteImage && review.getImage() != null) {
            fileUtil.deleteFile(review.getImage());
            review.setImage(null);
        }

        // 새 이미지로 변경하는 경우
        if(imageFile != null && !imageFile.isEmpty()) {
            if(review.getImage() != null) {
                fileUtil.deleteFile(review.getImage());
            }
            String updateFileName = fileUtil.uploadFile(imageFile, "review");
            review.setImage(updateFileName);
        }
    }

    // 리뷰 삭제
    // 마이페이지 리뷰 삭제
    public void deleteReviewByUser(Long reviewId, Long userId) {
        // 리뷰 조회
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
        // 본인 확인
        if (!review.getReservationItem().getReservation().getUser().getUserId().equals(userId)) {
            throw new SecurityException("본인의 리뷰만 삭제할 수 있습니다.");
        }
        // 이미지파일 삭제
        if (review.getImage() != null && !review.getImage().isEmpty()) {
            fileUtil.deleteFile((review.getImage()));
        }
        // 답변 삭제
        if(reviewReplyRepository.existsByReview_ReviewId(reviewId)) {
            reviewReplyRepository.deleteByReview_ReviewId(reviewId);
        }
        // 리뷰 삭제
        reviewRepository.delete(review);
    }

    // 관리자페이지 리뷰 삭제
    public void deleteReviewByAdmin(Long reviewId) {
        // 리뷰 확인
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
        // 이미지파일 삭제
        if(review.getImage() != null && !review.getImage().isEmpty()) {
            fileUtil.deleteFile(review.getImage());
        }
        // 답변 삭제
        if(reviewReplyRepository.existsByReview_ReviewId(reviewId)) {
            reviewReplyRepository.deleteByReview_ReviewId(reviewId);
        }
        // 리뷰 삭제
        reviewRepository.delete(review);
    }

    // 리뷰 목록
    // 아이템페이지 리뷰 리스트
    public Page<ReviewListDTO> getReviewListByItem(Long itemId, String sortType, Pageable pageable) {
        Pageable pageOnly = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        return reviewRepository.findReviewListByItemWithReply(itemId, sortType, pageOnly);
    }

    // 관리자페이지 리뷰 리스트
    public Page<AdminReviewListDTO> getReviewWithReplyForAdmin(Long rentId, String username, String itemName, Boolean hasReply, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize()
        );
        return reviewRepository.findAllReviewWithReplyForAdmin(rentId, username, itemName, hasReply, sortedPageable);
    }

    // 마이페이지 리뷰 리스트
    public Page<UserReviewListDTO> getUserReviewList(Long userId, LocalDateTime startDate, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize()
        );
        return reviewRepository.findUserReviewListByUserIdAndDate(userId, startDate, sortedPageable);
    }

    // 리뷰 단건 조회 (수정용)
    public ReviewUpdateDTO getReviewUpdateInfo(Long reviewId) {
        return reviewRepository.findReviewUpdateInfoById(reviewId);
    }

    // 총 리뷰 수, 평균
    public ReviewStatsDTO getReviewStats(Long itemId){
        return reviewRepository.getReviewsStatsByItemId(itemId);
    }

    // 렌트 아이디 리스트의 리뷰 평점 받아오기
    public Map<Long, Double> getAverageRatingsOf(List<Long> rentIds) {
        List<Tuple> tuples = jpaQueryFactory
                .select(rent.rentId, review.rating.avg())
                .from(review)
                .join(review.reservationItem, reservationItem)
                .join(reservationItem.reservation, reservation)
                .join(reservation.rent, rent)
                .where(rent.rentId.in(rentIds))
                .groupBy(rent.rentId)
                .fetch();

        return tuples.stream().collect(
                Collectors.toMap(
                        tuple -> tuple.get(rent.rentId),
                        tuple -> Optional.ofNullable(tuple.get(review.rating.avg())).orElse(0.0)
                )
        );
    }

    // Review 3개월 마다 자동 삭제
    @Scheduled(cron = "0 0 0 * * ?") // 매 자정마다 실행
    public void deleteOldQna() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(3); // 3개월 단위 Q&A 삭제
        qnaRepository.deleteByCreatedAtBefore(cutoffDate);
    }
}
