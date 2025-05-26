package com.example.skip.repository;

import com.example.skip.entity.ActiveBannerList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActiveBannerListRepository extends JpaRepository<ActiveBannerList, Long> {
    List<ActiveBannerList> findAllByUploadDateBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
}
