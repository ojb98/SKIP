package com.example.skip.repository;

import com.example.skip.entity.ReservationItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.skip.enumeration.ItemCategory;
import java.time.LocalDateTime;

public interface ReservationItemsRepository extends JpaRepository<ReservationItems, Long> {
    @Query("""
    SELECT COUNT(DISTINCT p)
    FROM ReservationItems ri
    JOIN ri.reservations r
    JOIN Payment p ON p.reservations = r
    JOIN ri.itemDetail id
    JOIN id.item i
    WHERE i.category = :category
    AND p.createdAt >= :start
    AND p.createdAt <= :end
""")
    Long countPaymentsByItemCategory(@Param("category") ItemCategory category, @Param("start") LocalDateTime start, @Param("end")LocalDateTime end);
}
