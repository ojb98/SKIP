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

    List<Payment> findAllByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    @Query("""
    SELECT SUM(p.totalPrice) 
    FROM Payment p 
    WHERE p.createdAt >= :start AND p.createdAt < :end AND p.status = 'PAID'
    """)
    Double getTotalPaidPriceBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COUNT(p) 
    FROM Payment p 
    WHERE p.createdAt >= :start 
    AND p.createdAt < :end AND p.status = 'PAID'
""")
    Long getPaidCountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COALESCE(SUM(p.totalPrice), 0)
    FROM Payment p
    WHERE p.status = 'PAID'
    AND p.createdAt BETWEEN :start AND :end
    """)
    Double getRentTotalSales(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COALESCE(SUM(a.totalPrice), 0)
    FROM AdPayment a
    WHERE a.createdAt BETWEEN :start AND :end
    """)
    Double getAdTotalSales(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COUNT(p)
    FROM Payment p
    WHERE p.status = 'PAID'
    AND p.createdAt BETWEEN :start AND :end
    """)
    Long getRentTotalCount(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COUNT(a)
    FROM AdPayment a
    WHERE a.createdAt BETWEEN :start AND :end
    """)
    Long getAdTotalCount(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COALESCE(SUM(p.adminPrice), 0)
    FROM Payment p
    WHERE p.status = 'PAID'
    AND p.createdAt BETWEEN :start AND :end
    """)
    Double getAdminProfit(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COALESCE(SUM(p.totalPrice), 0)
    FROM Payment p
    WHERE p.status = 'CANCELLED'
    AND p.createdAt BETWEEN :start AND :end
    """)
    Double getCancelledSales(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
    SELECT COUNT(p)
    FROM Payment p
    WHERE p.status = 'CANCELLED'
    AND p.createdAt BETWEEN :start AND :end
    """)
    Long getCancelledCount(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(b) FROM ActiveBannerList b WHERE b.uploadDate BETWEEN :start AND :end")
    Long countBanner(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(bs) FROM Boost bs WHERE bs.endDate BETWEEN :start AND :end")
    Long countBoost(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


    @Query("""
    SELECT COUNT(bw)
    FROM BannerWaitingList bw
    WHERE bw.createdAt BETWEEN :start AND :end
    """)
    Long getBannerWaitingCount(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p FROM Payment p JOIN p.reservations r WHERE r.user.userId = :userId ORDER BY p.createdAt DESC")
    List<Payment> findTop5ByUserIdInReservations(@Param("userId") Long userId);
}