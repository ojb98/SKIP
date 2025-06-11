package com.example.skip.repository;

import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.enumeration.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
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


    List<ReservationItem> findAllByReservation(Reservation reservation);
}