package com.example.skip.repository;

import com.example.skip.entity.ActiveBannerList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActiveBannerListRepository extends JpaRepository<ActiveBannerList, Long> {
}
