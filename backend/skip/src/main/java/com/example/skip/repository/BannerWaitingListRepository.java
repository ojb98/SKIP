package com.example.skip.repository;

import com.example.skip.entity.BannerWaitingList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BannerWaitingListRepository extends JpaRepository<BannerWaitingList, Long> {
}
