package com.example.skip.repository;

import com.example.skip.entity.ReservationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.skip.enumeration.ItemCategory;
import java.time.LocalDateTime;

public interface ReservationItemsRepository extends JpaRepository<ReservationItem, Long> {
    @Query("""
    SELECT COUNT(DISTINCT p)
    FROM ReservationItem ri
    JOIN ri.reservation r
    JOIN Payment p ON p.reservation = r
    JOIN ri.itemDetail id
    JOIN id.item i
    WHERE i.category = :category
    AND p.createdAt >= :start
    AND p.createdAt <= :end
""")
    Long countPaymentsByItemCategory(@Param("category") ItemCategory category, @Param("start") LocalDateTime start, @Param("end")LocalDateTime end);
}
