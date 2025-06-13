package com.example.skip.repository;

import com.example.skip.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 본인 리뷰 조회
    Page<Review> findAllByReservation_User_UserId(Long userId, Pageable pageable);

    // 본인 렌탈샵 리뷰 조회
    Page<Review> findAllByReservation_Rent_RentId(Long rentId, Pageable pageable);

    List<Review> findTop5ByReservation_User_UserIdOrderByCreatedAtDesc(Long userId);
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reservation.rent.rentId = :rentId")
    BigDecimal findAverageRatingByRentId(@Param("rentId") Long rentId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reservation.rent.rentId = :rentId AND r.createdAt >= :recent")
    BigDecimal findRecent7dRatingByRentId(@Param("rentId") Long rentId, @Param("recent") LocalDateTime recent);
}
