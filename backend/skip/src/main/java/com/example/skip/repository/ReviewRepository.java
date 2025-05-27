package com.example.skip.repository;

import com.example.skip.entity.Payment;
import com.example.skip.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 본인 리뷰 조회
    Page<Review> findAllByReservations_User_UserId(Long userId, Pageable pageable);

    // 본인 렌탈샵 리뷰 조회
    Page<Review> findAllByReservations_Rent_RentId(Long rentId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.reservations.user.userId = :userId ORDER BY r.createdAt DESC")
    List<Review> findTop5ByUserId(@Param("userId") Long userId, Pageable pageable);
}
