package com.example.skip.repository;

import com.example.skip.entity.BannerWaitingList;
import com.example.skip.enumeration.BannerWaitingListStatus;
import org.springframework.beans.PropertyValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerWaitingListRepository extends JpaRepository<BannerWaitingList, Long> {
    List<BannerWaitingList> findAllByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
    List<BannerWaitingList> findByStatus(BannerWaitingListStatus status);

    //status : Enum.PENDING && RegistDay : 이번주 월요일 AM 3:00
    List<BannerWaitingList> findAllByStatusNotAndRegistDayBetween(
            BannerWaitingListStatus status,
            LocalDateTime start,
            LocalDateTime end
    );


    List<BannerWaitingList> findAllByStatusAndRegistDayBetween(
            BannerWaitingListStatus status,
            LocalDateTime start,
            LocalDateTime end
    );
}