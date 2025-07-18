package com.example.skip.repository;

import com.example.skip.entity.BannerActiveList;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.enumeration.BannerActiveListStatus;
import com.example.skip.enumeration.BannerWaitingListStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerActiveListRepository extends JpaRepository<BannerActiveList, Long> {
    List<BannerActiveList> findAllByUploadDateBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    //status : Enum.PENDING && RegistDay : 다음주 월요일 AM 3:00
    List<BannerActiveList> findAllByEndDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<BannerActiveList> findByStatus(BannerActiveListStatus status);

    //한 개 렌탈샵 배너 중복신청방지
    boolean existsByRent_RentIdAndStatus(Long rentId, BannerActiveListStatus status);
}
