package com.example.skip.repository;

import com.example.skip.entity.AdPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdPaymentRepository extends JpaRepository<AdPayment, Long> {
    List<AdPayment> findAllByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
    // 필요시 커스텀 메소드 추가
}
