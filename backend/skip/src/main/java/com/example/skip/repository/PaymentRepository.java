package com.example.skip.repository;

import com.example.skip.entity.Payment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT SUM(p.totalPrice) FROM Payment p WHERE p.createdAt BETWEEN :atStart AND :atEnd")
    Long getTotalSales(@Param("atStart") String atStart, @Param("atEnd") String atEnd);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'CONFIRMED' AND p.createdAt BETWEEN :atStart AND :atEnd")
    Long getConfirmReserv(@Param("atStart") String atStart, @Param("atEnd") String atEnd);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'CANCELLED' AND p.createdAt BETWEEN :atStart AND :atEnd")
    Long getCancleReserv(@Param("atStart") String atStart, @Param("atEnd") String atEnd);

    @Query("SELECT new map(DATE(p.createdAt) as date, SUM(p.totalPrice) as total) " +
            "FROM Payment p " +
            "WHERE p.createdAt BETWEEN :start AND :end " +
            "GROUP BY DATE(p.createdAt)")
    List<Map<String, Object>> getDailySales(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
    @Query("SELECT p.method AS method, SUM(p.totalPrice) AS total " +
            "FROM Payment p " +
            "WHERE p.createdAt BETWEEN :atStart AND :atEnd " +
            "GROUP BY p.method " +
            "ORDER BY p.method")
    List<Map<String, Object>> getCategorySales(
            @Param("atStart") LocalDateTime atStart,
            @Param("atEnd") LocalDateTime atEnd
    );
    List<Payment> findAllByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    @Query("SELECT p FROM Payment p WHERE p.reservations.user.userId = :userId ORDER BY p.createdAt DESC")
    List<Payment> findTop5ByUserId(@Param("userId") Long userId, Pageable pageable);

}