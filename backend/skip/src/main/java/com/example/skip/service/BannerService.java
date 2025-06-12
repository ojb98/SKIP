package com.example.skip.service;

import com.example.skip.dto.banner.BannerWaitingListDTO;
import com.example.skip.entity.ActiveBannerList;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.enumeration.BannerWaitingListStatus;
import com.example.skip.repository.ActiveBannerListRepository;
import com.example.skip.repository.BannerWaitingListRepository;
import com.example.skip.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerWaitingListRepository bannerWaitingListRepository;
    private final ActiveBannerListRepository activeBannerListRepository;
    private final ReviewRepository reviewRepository;

    // 대기 배너 리스트 조회
    public List<BannerWaitingList> getAllBannerWaitingLists() {
        return bannerWaitingListRepository.findAll();
    }

    public List<BannerWaitingListDTO> getWaitingBanners() {
        LocalDate today = LocalDate.now();

        // 항상 다음 주 월요일 계산
        LocalDate nextMonday = today.with(java.time.temporal.TemporalAdjusters.next(DayOfWeek.MONDAY));

        // 오전 3시로 세팅
        LocalDateTime mondayAt3AM = nextMonday.atTime(3, 0);
        LocalDateTime mondayAt3AM1M = nextMonday.atTime(3, 1);

        // 1. 대기 배너 엔티티들 조회
        List<BannerWaitingList> banners = bannerWaitingListRepository
                .findAllByStatusNotAndRegistDayBetween(BannerWaitingListStatus.APPROVED, mondayAt3AM, mondayAt3AM1M);

        // 2. 각 배너마다 평점 계산 → 엔티티 필드에 set (메모리에서만)
        banners.forEach(this::populateRatings);  // 저장은 하지 않음

        // 3. DTO 변환
        return banners.stream()
                .map(BannerWaitingListDTO::new)
                .toList();
    }
    // 활성 배너 리스트 조회
    public List<ActiveBannerList> getAllActiveBannerLists() {
        return activeBannerListRepository.findAll();
    }

    // 단일 배너 조회
    public Optional<BannerWaitingList> getBannerWaitingById(Long id) {
        return bannerWaitingListRepository.findById(id);
    }

    public Optional<ActiveBannerList> getActiveBannerById(Long id) {
        return activeBannerListRepository.findById(id);
    }

    // 배너 저장
    public BannerWaitingList saveBannerWaitingList(BannerWaitingList banner) {
        return bannerWaitingListRepository.save(banner);
    }

    public ActiveBannerList saveActiveBannerList(ActiveBannerList banner) {
        return activeBannerListRepository.save(banner);
    }

    // 배너 삭제
    public void deleteBannerWaitingList(Long id) {
        bannerWaitingListRepository.deleteById(id);
    }

    public void deleteActiveBannerList(Long id) {
        activeBannerListRepository.deleteById(id);
    }

    // 배너 승인 처리
    public void approveBanner(Long waitingId) {
        BannerWaitingList banner = bannerWaitingListRepository.findById(waitingId)
                .orElseThrow(() -> new IllegalArgumentException("배너 요청을 찾을 수 없습니다."));
        banner.setStatus(BannerWaitingListStatus.APPROVED);
        bannerWaitingListRepository.save(banner);
    }

    // 배너 반려 처리
    public void rejectBanner(Long waitingId, String reason) {
        BannerWaitingList banner = bannerWaitingListRepository.findById(waitingId)
                .orElseThrow(() -> new IllegalArgumentException("배너 요청을 찾을 수 없습니다."));
        banner.setStatus(BannerWaitingListStatus.WITHDRAWN);
        banner.setComments(reason);
        bannerWaitingListRepository.save(banner);
    }
    // 가게평균별점, 가게최근7일평균별점 구하기
    public void populateRatings(BannerWaitingList banner) {
        Long rentId = banner.getRent().getRentId();

        BigDecimal avgRating = reviewRepository.findAverageRatingByRentId(rentId);
        BigDecimal recentRating = reviewRepository.findRecent7dRatingByRentId(rentId, LocalDateTime.now().minusDays(7));

        banner.setAverageRating(avgRating != null ? avgRating : BigDecimal.ZERO);
        banner.setRecent7dRating(recentRating != null ? recentRating : BigDecimal.ZERO);

        bannerWaitingListRepository.save(banner); // 변경 사항 저장
    }

}