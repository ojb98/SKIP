package com.example.skip.repository.reservation;

import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.enumeration.ItemCategory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ReservationItemRepository extends JpaRepository<ReservationItem, Long> {
    @Query("""
    SELECT COUNT(DISTINCT p)
    FROM ReservationItem ri
    JOIN ri.reservation r
    JOIN r.payment p
    JOIN ri.itemDetail id
    JOIN id.item i
    WHERE i.category = :category
    AND p.createdAt BETWEEN :start AND :end
    """)
    Long countPaymentsByItemCategory(
            @Param("category") ItemCategory category,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // 비관적 락 : 다른 트랜잭션의 읽기/쓰기 모두 차단(재고 수량 변경 위하기 위해 먼저 예약상세 접근 막기)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM ReservationItem r WHERE r.rentItemId = :rentItemId")
    Optional<ReservationItem> findByIdWithLock(@Param("rentItemId") Long rentItemId);

    Optional<ReservationItem> findByReservation(Reservation reservation);
}