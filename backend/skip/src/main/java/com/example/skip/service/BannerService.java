package com.example.skip.service;

import com.example.skip.dto.ActiveBannerListDto;
import com.example.skip.entity.ActiveBannerList;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.entity.QActiveBannerList;
import com.example.skip.entity.QRent;
import com.example.skip.repository.ActiveBannerListRepository;
import com.example.skip.repository.BannerWaitingListRepository;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class BannerService {
    @Autowired
    private BannerWaitingListRepository bannerWaitingListRepository;

    @Autowired
    private ActiveBannerListRepository activeBannerListRepository;

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    private static final QActiveBannerList activeBannerList = QActiveBannerList.activeBannerList;

    private static final QRent rent = QRent.rent;


    // 대기 배너 리스트 조회
    public List<BannerWaitingList> getAllBannerWaitingLists() {
        return bannerWaitingListRepository.findAll();
    }

    // 활성 배너 리스트 조회
    public List<ActiveBannerList> getAllActiveBannerLists() {
        return activeBannerListRepository.findAll();
    }

    // 활성 배너 파이널 스코어 기준 내림차순 정렬 후 조회
    @Cacheable(value = "activeBannerLists", key = "'all'", unless = "#result == null") // 캐시 선언
    public List<ActiveBannerListDto> getActiveBannerListOrderedByFinalScore() {
        System.out.println("~~~~~~~");
        List<ActiveBannerListDto> list = jpaQueryFactory.select(Projections.constructor(ActiveBannerListDto.class,
                        activeBannerList.bannerId,
                        rent.rentId,
                        activeBannerList.bannerImage,
                        activeBannerList.clickCnt,
                        activeBannerList.cpcBid,
                        activeBannerList.finalScore,
                        activeBannerList.endDate,
                        activeBannerList.uploadDate))
                .from(activeBannerList)
                .orderBy(activeBannerList.finalScore.desc())
                .fetch();

        log.info("list: {}", list);

        return list;
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

    @CacheEvict(value = "activeBannerLists", key = "'all'") // 캐시 초기화
    public ActiveBannerList saveActiveBannerList(ActiveBannerList banner) {
        return activeBannerListRepository.save(banner);
    }

    // 배너 삭제
    public void deleteBannerWaitingList(Long id) {
        bannerWaitingListRepository.deleteById(id);
    }

    @CacheEvict(value = "activeBannerLists", key = "'all'") // 캐시 초기화
    public void deleteActiveBannerList(Long id) {
        activeBannerListRepository.deleteById(id);
    }


}
