package com.example.skip.repository;

import com.example.skip.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {


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
