package com.example.skip.repository;

import com.example.skip.dto.ReviewListDTO;
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
    Page<Review> findAllByReservation_User_UserId(Long userId, Pageable pageable);

    // 본인 렌탈샵 리뷰 조회
    Page<Review> findAllByReservation_Rent_RentId(Long rentId, Pageable pageable);

    List<Review> findTop5ByReservation_User_UserIdOrderByCreatedAtDesc(Long userId);

}
