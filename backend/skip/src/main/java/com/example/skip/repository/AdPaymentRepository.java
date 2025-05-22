package com.example.skip.repository;

import com.example.skip.entity.AdPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdPaymentRepository extends JpaRepository<AdPayment, Long> {
    // 필요시 커스텀 메소드 추가
}
