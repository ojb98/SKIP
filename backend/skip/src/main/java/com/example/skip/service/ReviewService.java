package com.example.skip.service;


import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.dto.ReviewResponseDTO;
import com.example.skip.entity.*;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.ReservationRepository;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.util.FileUtil;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    private final UserRepository userRepository;
    private final FileUtil fileUtil;
    private final JPAQueryFactory jpaQueryFactory;

    private static final QReview review = QReview.review;
    private static final QReservation reservation = QReservation.reservation;
    private static final QRent rent = QRent.rent;

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


    // 렌트 아이디 리스트의 리뷰 평점 받아오기
    public Map<Long, Double> getAverageRatingsOf(List<Long> rentIds) {
        List<Tuple> tuples = jpaQueryFactory
                .select(review.reservation.rent.rentId, review.rating.avg())
                .from(review)
                .join(review.reservation, reservation)
                .join(reservation.rent, rent)
                .where(review.reservation.rent.rentId.in(rentIds))
                .groupBy(review.reservation.rent.rentId)
                .fetch();

        return tuples.stream().collect(
                Collectors.toMap(
                        tuple -> tuple.get(review.reservation.rent.rentId),
                        tuple -> Optional.ofNullable(tuple.get(review.rating.avg())).orElse(0.0)
                )
        );
    }
}
