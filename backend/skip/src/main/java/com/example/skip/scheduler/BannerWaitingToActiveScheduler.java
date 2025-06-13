package com.example.skip.scheduler;


import com.example.skip.entity.BannerActiveList;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.enumeration.BannerActiveListStatus;
import com.example.skip.enumeration.BannerWaitingListStatus;
import com.example.skip.repository.BannerActiveListRepository;
import com.example.skip.repository.BannerWaitingListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class BannerWaitingToActiveScheduler {
    private final BannerWaitingListRepository bannerWaitingListRepository;
    private final BannerActiveListRepository bannerActiveListRepository;

    @Transactional
    @Scheduled(cron = "0 0 3 * * MON") // 매주 월요일 새벽 3시 실행
    public void toActive() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next10Minute = now.plusMinutes(10);

        //등록할 대기리스트
        List<BannerWaitingList> targetsToActive = bannerWaitingListRepository
                .findAllByStatusAndRegistDayBetween(
                        BannerWaitingListStatus.APPROVED,
                        now.minusMinutes(1),
                        next10Minute
                );

        //비활성화할 active리스트
        List<BannerActiveList> targetsToDisable = bannerActiveListRepository
                .findAllByEndDateBetween(now, next10Minute);

        for (BannerActiveList banner : targetsToDisable) {
            banner.setStatus(BannerActiveListStatus.DISABLE);
        }
        bannerActiveListRepository.saveAll(targetsToDisable);

        if (targetsToDisable.isEmpty()){
            log.info("[배너 스케줄러] 비활성화할 배너가 없습니다. ({})",now);
        }
        if (targetsToActive.isEmpty()) {
            log.info("[배너 스케줄러] 활성화할 배너가 없습니다. ({})", now);
            return;
        }


        //  cpc 정규화 최솟값/최댓값구하기
        int minCpc = targetsToActive.stream().mapToInt(BannerWaitingList::getCpcBid).min().orElse(1);
        int maxCpc = targetsToActive.stream().mapToInt(BannerWaitingList::getCpcBid).max().orElse(1);

        for (BannerWaitingList waiting : targetsToActive) {
            double score = getScore(waiting, maxCpc, minCpc);

            // AcitiveBannerList에 등록
            // finalscore =
            BannerActiveList active = BannerActiveList.builder()
                    .rent(waiting.getRent())
                    .bannerImage(waiting.getBannerImage())
                    .clickCnt(0)
                    .cpcBid(waiting.getCpcBid())
                    .finalScore(BigDecimal.valueOf(score))
                    .endDate(waiting.getRegistDay().plusWeeks(1))
                    .build();

            bannerActiveListRepository.save(active);
            bannerWaitingListRepository.delete(waiting);

        }



        log.info("[배너 스케줄러] {}건의 배너가 활성화되었습니다.", targetsToActive.size());
        log.info("[배너 스케줄러] {}건의 배너가 비활성화되었습니다.", targetsToDisable.size());
    }

    private static double getScore(BannerWaitingList waiting, int maxCpc, int minCpc) {
        BigDecimal avgRating = waiting.getAverageRating() != null ? waiting.getAverageRating() : BigDecimal.ZERO;
        BigDecimal recentRating = waiting.getRecent7dRating() != null ? waiting.getRecent7dRating() : BigDecimal.ZERO;

        // CPC 정규화 (0 ~ 1)
        double normalizedCpc = 0.0;
        if (maxCpc != minCpc) {
            normalizedCpc = (double) (waiting.getCpcBid() - minCpc) / (maxCpc - minCpc);
        }

        // finalScore 계산 ---종합점수 비율
        double score = avgRating.doubleValue() * 0.2
                    + normalizedCpc * 0.3
                    + recentRating.doubleValue() * 0.5;
        return score;
    }
}
