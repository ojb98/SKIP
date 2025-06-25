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
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    //대기중인 배너 조회
    public List<BannerWaitingListDTO> getWaitingBanners() {
        // 1. 대기 배너 엔티티들 조회
        List<BannerWaitingList> banners = bannerWaitingListRepository
                .findByStatus(BannerWaitingListStatus.PENDING);

        // 2. 각 배너마다 평점 계산 → 엔티티 필드에 set (메모리에서만)
        banners.forEach(this::populateRatings);  // 저장은 하지 않음

        // 3. DTO 변환
        return banners.stream()
                .map(BannerWaitingListDTO::new)
                .toList();
    }
    //승인된 대기 배너 조회
    public List<BannerWaitingListDTO> getApprovedWaitingBanners() {
        List<BannerWaitingList> banners = bannerWaitingListRepository
                .findByStatus(BannerWaitingListStatus.PENDING);
        banners.forEach(this::populateRatings);
        return banners.stream()
                .map(BannerWaitingListDTO::new)
                .toList();
    }


    //등록된 배너 조회
    public List<BannerActiveListDTO> getActiveBanners() {
        // 1. 등록된 배너 엔티티 조회
        List<BannerActiveList> banners = bannerActiveListRepository
                .findByStatus(BannerActiveListStatus.ACTIVE);
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
        BigDecimal recentRating = reviewRepository.findRecent7dRatingByRentId(rentId, LocalDateTime.now(SEOUL_ZONE).minusDays(7));

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

    private static final int FiveMin_CLICK_PER_IP = 5;
    private static final int OneHour_CLICK_PER_IP = 8;
    private static final String IP_KEY_PREFIX = "banner:click:ip:";

    // 배너 클릭 버퍼링  - 1시간에 5회 이상 클릭 시 클릭당 비용이 더이상 차감되지 않음
    public void clickBanner(Long bannerId, String ip) {
        String ipKey = IP_KEY_PREFIX + ip + ":" + bannerId;
        Long countFor5Minutes = redisTemplate.opsForValue().increment(ipKey);
        Long countFor1Hour = redisTemplate.opsForValue().increment(ipKey);
        if (countFor5Minutes != null && countFor5Minutes == 1) {
            redisTemplate.expire(ipKey, java.time.Duration.ofMinutes(5)); //5분 후 초기화
        }
        if (countFor1Hour != null && countFor1Hour == 1) {
            redisTemplate.expire(ipKey, java.time.Duration.ofHours(1)); //1시간 후 초기화
        }
        //
        if (countFor5Minutes != null && countFor5Minutes > FiveMin_CLICK_PER_IP) {  //5분이내 누적 5회클릭 이상 = 광고비차감X
            log.warn("IP {} banner {} 과다 클릭 감지", ip, bannerId);
            return;
        }
        if (countFor1Hour != null && countFor1Hour > OneHour_CLICK_PER_IP) { //1시간이내 누적 8회클릭 이상 = 광고비차감X
            log.warn("IP {} banner {} 과다 클릭 감지", ip, bannerId);
            return;
        }
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