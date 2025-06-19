package com.example.skip.service;

import com.example.skip.entity.*;
import com.example.skip.enumeration.BannerActiveListStatus;
import com.example.skip.repository.*;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import com.example.skip.dto.banner.BannerActiveListDTO;
import com.example.skip.dto.banner.BannerWaitingListDTO;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.enumeration.BannerWaitingListStatus;
import com.example.skip.repository.BannerWaitingListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BannerService {

    private final BannerWaitingListRepository bannerWaitingListRepository;
    private final BannerActiveListRepository bannerActiveListRepository;
    private final ReviewRepository reviewRepository;
    private final RedisTemplate<String, Objects> redisTemplate;

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    private static final QBannerActiveList bannerActiveList = QBannerActiveList.bannerActiveList;
    private static final QRent rent = QRent.rent;
    private static final String REDIS_KEY = "banner:clicks";
    private final RentRepository rentRepository;

    LocalDate today = LocalDate.now();
    // 항상 다음 주 월요일 계산
    LocalDate nextMonday = today.with(java.time.temporal.TemporalAdjusters.next(DayOfWeek.MONDAY));
    // 오전 3시로 세팅
    LocalDateTime mondayAt3AM = nextMonday.atTime(2, 59);
    LocalDateTime mondayAt3AM10M = nextMonday.atTime(3, 10);

    //대기중인 배너 조회
    public List<BannerWaitingListDTO> getWaitingBanners() {
        // 1. 대기 배너 엔티티들 조회
        List<BannerWaitingList> banners = bannerWaitingListRepository
                .findAllByStatusNotAndRegistDayBetween(BannerWaitingListStatus.APPROVED, mondayAt3AM, mondayAt3AM10M);

        // 2. 각 배너마다 평점 계산 → 엔티티 필드에 set (메모리에서만)
        banners.forEach(this::populateRatings);  // 저장은 하지 않음

        // 3. DTO 변환
        return banners.stream()
                .map(BannerWaitingListDTO::new)
                .toList();
    }

    //등록된 배너 조회
    public List<BannerActiveListDTO> getActiveBanners() {
        // 1. 등록된 배너 엔티티 조회
        List<BannerActiveList> banners = bannerActiveListRepository
                .findAllByEndDateBetween(mondayAt3AM, mondayAt3AM10M);
        //

        // 3. DTO 변환
        return banners.stream()
                .map(BannerActiveListDTO::new)
                .toList();
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


    // 대기 배너 리스트 조회
    public List<BannerWaitingList> getAllBannerWaitingLists() {
        return bannerWaitingListRepository.findAll();
    }
    // 활성 배너 리스트 조회
    public List<BannerActiveList> getAllActiveBannerLists() {
        return bannerActiveListRepository.findAll();
    }

    // 활성 배너 파이널 스코어 기준 내림차순 정렬 후 조회
    @Cacheable(value = "activeBannerLists", key = "'all'", unless = "#result == null") // 캐시 선언
    public List<BannerActiveListDTO> getActiveBannerListOrderedByFinalScore() {
        List<BannerActiveListDTO> list = jpaQueryFactory.select(Projections.constructor(BannerActiveListDTO.class,
                        bannerActiveList.bannerId,
                        rent.rentId,
                        rent.name,
                        bannerActiveList.bannerImage,
                        bannerActiveList.clickCnt,
                        bannerActiveList.cpcBid,
                        bannerActiveList.finalScore,
                        bannerActiveList.endDate,
                        bannerActiveList.uploadDate,
                        bannerActiveList.status))
                .from(bannerActiveList)
                .where(bannerActiveList.status.eq(BannerActiveListStatus.ACTIVE))
                .orderBy(bannerActiveList.finalScore.desc())
                .fetch();

        log.info("list: {}", list);

        return list;
    }

    // 배너 클릭 버퍼링
    public void clickBanner(Long bannerId) {
        redisTemplate.opsForHash().increment(REDIS_KEY, bannerId.toString(), 1);
    }

    // 배너 클릭 플러시
    @Scheduled(fixedRate = 5 * 60 * 1000) // 5분마다 flush
    public void flushClicks() {
        Map<Object, Object> allClicks = redisTemplate.opsForHash().entries(REDIS_KEY);
        for (Map.Entry<Object, Object> entry : allClicks.entrySet()) {
            Long bannerId = Long.valueOf(entry.getKey().toString());
            int count = Integer.parseInt(entry.getValue().toString());

            BannerActiveList bannerActiveList = bannerActiveListRepository.findById(bannerId).orElseThrow();

            bannerActiveList.setClickCnt(bannerActiveList.getClickCnt() + count);

            int totalCost = bannerActiveList.getCpcBid() * count;
            Rent rent = bannerActiveList.getRent();
            rent.setRemainAdCash(rent.getRemainAdCash() - totalCost);

            if (rent.getRemainAdCash() < 0) {
                bannerActiveList.setStatus(BannerActiveListStatus.DISABLE);
                log.info("배너 {} 잔액 부족으로 비활성화", bannerId);
            }

            rentRepository.save(rent);
            bannerActiveListRepository.save(bannerActiveList);
            log.info("{}: flushed", bannerId);
        }
        redisTemplate.delete(REDIS_KEY);
    }

    // 단일 배너 조회
    public Optional<BannerWaitingList> getBannerWaitingById(Long id) {
        return bannerWaitingListRepository.findById(id);
    }

    public Optional<BannerActiveList> getActiveBannerById(Long id) {
        return bannerActiveListRepository.findById(id);
    }

    // 배너 저장
    public BannerWaitingList saveBannerWaitingList(BannerWaitingList banner) {
        return bannerWaitingListRepository.save(banner);
    }

    @CacheEvict(value = "activeBannerLists", key = "'all'") // 캐시 초기화
    public BannerActiveList saveBannerActiveList(BannerActiveList banner) {
        return bannerActiveListRepository.save(banner);
    }


    // 배너 삭제
    public void deleteBannerWaitingList(Long id) {
        bannerWaitingListRepository.deleteById(id);
    }

    @CacheEvict(value = "activeBannerLists", key = "'all'") // 캐시 초기화
    public void deleteActiveBannerList(Long id) {
        bannerActiveListRepository.deleteById(id);
    }

}