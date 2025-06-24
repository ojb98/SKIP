package com.example.skip.repository;

import com.example.skip.dto.projection.*;
import com.example.skip.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 아이템페이지 리뷰 리스트
    @Query(value = """
    SELECT
        r.reviewId AS reviewId,
        ri.rentItemId AS rentItemId,
        r.rating AS rating,
        r.content AS content,
        r.image AS image,
        r.createdAt AS createdAt,
        r.updatedAt AS updatedAt,
        u.username AS username,
        u.image AS userImage,
        i.name AS itemName,
        idt.size AS size,
        rr.replyId AS replyId,
        rr.user.userId AS replyUserId,
        ru.image AS replyAdminUserImage,
        rr.content AS replyContent,
        rr.createdAt AS replyCreatedAt,
        rr.updatedAt AS replyUpdatedAt,
        ru.username AS adminUsername
    FROM Review r
    JOIN r.reservationItem ri
    JOIN ri.reservation res
    JOIN res.user u
    JOIN ri.itemDetail idt
    JOIN idt.item i
    LEFT JOIN ReviewReply rr ON rr.review = r
    LEFT JOIN rr.user ru
    WHERE i.itemId = :itemId
    ORDER BY
        CASE WHEN :sort = 'highRating' THEN r.rating END DESC,
        CASE WHEN :sort = 'lowRating' THEN r.rating END ASC,
        CASE WHEN :sort = 'recent' THEN r.createdAt END DESC,
        r.createdAt DESC
    """
/*    countQuery = """
        SELECT COUNT(r)
        FROM Review r
        JOIN r.reservationItem ri
        JOIN ri.itemDetail idt
        JOIN idt.item i
        WHERE i.itemId = :itemId
    """*/
    )
    Page<ReviewListDTO> findReviewListByItemWithReply(
            @Param("itemId") Long itemId,
            @Param("sort") String sort,
            Pageable pageable
    );

    // 관리자페이지 리뷰 리스트
    @Query("""
        SELECT
            r.reviewId AS reviewId,
            ri.rentItemId AS rentItemId,
            res.rent.rentId AS rentId,
            r.rating AS rating,
            r.content AS content,
            r.image AS image,
            r.createdAt AS createdAt,
            r.updatedAt AS updatedAt,
            u.username AS username,
            i.name AS itemName,
            idt.size AS size,
            rr.replyId AS replyId,
            rr.user.userId AS replyUserId,
            rr.content AS replyContent,
            rr.createdAt AS replyCreatedAt,
            rr.updatedAt AS replyUpdatedAt,
            ru.username AS adminUsername
        FROM Review r
        JOIN r.reservationItem  ri
        JOIN ri.reservation res
        JOIN res.user u
        JOIN ri.itemDetail idt
        JOIN idt.item i
        LEFT JOIN ReviewReply rr ON rr.review = r
        LEFT JOIN rr.user ru
        WHERE res.rent.rentId =:rentId
        AND (:username IS NULL OR u.username LIKE %:username%)
        AND (:itemName IS NULL OR i.name LIKE %:itemName%)
        AND (:hasReply IS NULL OR
                (:hasReply = true AND rr.replyId IS NOT NULL) OR
                (:hasReply = false AND rr.replyId IS NULL)
             )
    """)
    Page<AdminReviewListDTO> findAllReviewWithReplyForAdmin(@Param("rentId") Long rentId,
                                                            @Param("username") String username,
                                                            @Param("itemName") String itemName,
                                                            @Param("hasReply") Boolean hasReply,
                                                            Pageable pageable);

    // 마이페이지 리뷰 리스트
    @Query("""
        SELECT
            r.reviewId AS reviewId,
            ri.rentItemId AS rentItemId,
            r.rating AS rating,
            r.content AS content,
            r.image AS image,
            r.createdAt AS createdAt,
            res.rent.rentId AS rentId,
            idt.item.itemId AS itemId,
            i.name AS itemName,
            i.image AS itemImage,
            idt.size AS size,
            rr.replyId AS replyId,
            rr.content AS replyContent,
            rr.createdAt AS replyCreatedAt
        FROM Review r
        JOIN r.reservationItem ri
        JOIN ri.reservation res
        JOIN ri.itemDetail idt
        JOIN idt.item i
        LEFT JOIN ReviewReply rr ON rr.review = r
        WHERE res.user.userId =:userId
        AND (:startDate IS NULL OR r.createdAt >=:startDate)
        ORDER BY r.createdAt DESC
    """)
    Page<UserReviewListDTO> findUserReviewListByUserIdAndDate(@Param("userId") Long userId,
                                                              @Param("startDate")LocalDateTime startDate,
                                                              Pageable pageable);


    // 리뷰 수정용 단건 조회
    @Query("""
        SELECT
            r.reviewId AS reviewId,
            r.rating AS rating,
            r.content AS content,
            r.image AS image,
            i.itemId AS itemId,
            i.name AS itemName,
            i.image AS itemImage,
            idt.size AS size,
            ri.rentStart AS rentStart,
            ri.rentEnd AS rentEnd
        FROM Review r
        JOIN r.reservationItem ri
        JOIN ri.itemDetail idt
        JOIN idt.item i
        WHERE r.reviewId =:reviewId
    """)
    ReviewUpdateDTO findReviewUpdateInfoById(@Param("reviewId") Long ReviewId);

    // 리뷰 평균 and 총계
    @Query("""
        SELECT
            count(r) AS count,
            coalesce(avg(r.rating),0) AS average
        FROM Review r
        JOIN r.reservationItem ri
        JOIN ri.itemDetail idt
        JOIN idt.item i
        WHERE i.itemId =:itemId
    """)
    ReviewStatsDTO getReviewsStatsByItemId(@Param("itemId") Long itemId);

    // 리뷰 수정
    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.reservationItem ri
        JOIN FETCH ri.itemDetail idt
        JOIN FETCH idt.item i
        WHERE r.reviewId =:reviewId
    """)
    Review findReviewDetailById(@Param("reviewId") Long reviewId);


    List<Review> findTop5ByReservationItem_Reservation_User_UserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reservationItem.reservation.rent.rentId = :rentId")
    BigDecimal findAverageRatingByRentId(@Param("rentId") Long rentId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reservationItem.reservation.rent.rentId = :rentId AND r.createdAt >= :recent")
    BigDecimal findRecent7dRatingByRentId(@Param("rentId") Long rentId, @Param("recent") LocalDateTime recent);

    // Scheduler 삭제 건수 반환
    @Modifying
    @Transactional
    @Query("DELETE FROM Review r WHERE r.createdAt < :cutoff")
    int deleteByCreatedAtBefore(LocalDateTime createdAtBefore);
}
