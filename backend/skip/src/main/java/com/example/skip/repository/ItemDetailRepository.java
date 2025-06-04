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

public interface ItemDetailRepository extends JpaRepository<ItemDetail,Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from ItemDetail i where i.itemDetailId = :id")
    Optional<ItemDetail> findByIdWithLock(@Param("id") Long id);

}
