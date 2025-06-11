package com.example.skip.repository;

import com.example.skip.entity.ItemDetail;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;


public interface ItemDetailRepository extends JpaRepository<ItemDetail, Long> {

    // 비관적 락 : 다른 트랜잭션의 읽기/쓰기 모두 차단
    // (주로 재고 감소, 좌석 예약, 중복 결제 방지 등 동시성 문제가 발생할 수 있는 상황에서 사용)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from ItemDetail i where i.itemDetailId = :id")
    Optional<ItemDetail> findByIdWithLock(@Param("id") Long id);

}
