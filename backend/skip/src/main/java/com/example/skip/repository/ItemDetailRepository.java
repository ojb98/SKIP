package com.example.skip.repository;

import com.example.skip.entity.Item;
import com.example.skip.entity.ItemDetail;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;


public interface ItemDetailRepository extends JpaRepository<ItemDetail, Long> {

    List<ItemDetail> findByItem(Item item);

    // 비관적 락 : 다른 트랜잭션의 읽기/쓰기 모두 차단(재고 수량 변경)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM ItemDetail i WHERE i.itemDetailId = :itemDetailId")
    Optional<ItemDetail> findByIdWithLock(@Param("itemDetailId") Long itemDetailId);

}
