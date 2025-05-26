package com.example.skip.repository;

import com.example.skip.entity.BannerWaitingList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerWaitingListRepository extends JpaRepository<BannerWaitingList, Long> {
    List<BannerWaitingList> findAllByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
}
