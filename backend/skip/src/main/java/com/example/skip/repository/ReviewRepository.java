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

    // 특정 렌탈샵 특정 아이템별 리뷰 조회
   /* @Query("""
        SELECT DISTINCT r FROM Review r
        Join r.reservations res
        Join ReservationItems ri ON ri.reservations = res
        Join ri.item i
        WHERE res.rent.rentId =:rentId AND i.itemId =:itemId
    """)
    Page<Review> findByRentIdAndItemId(@Param("rentId") Long rentId,
                                       @Param("itemId") Long itemId,
                                       Pageable pageable);*/

    // 리뷰 평점 평균
/*    @Query("""
        SELECT AVG(r.rating)
        FROM Review r
        JOIN r.reservations res
        JOIN ReservationItems ri ON ri.reservations = res
        JOIN ri.item i
        WHERE res.rent.rentId =:rentId AND i.itemId =:itemId
    """)
    Double findAverageRating(@Param("rentId") Long rentId,
                             @Param("itemId") Long itemId);*/

    List<Review> findTop5ByReservation_User_UserIdOrderByCreatedAtDesc(Long userId);
}
