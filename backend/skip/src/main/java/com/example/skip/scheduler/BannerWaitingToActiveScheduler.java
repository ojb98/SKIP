package com.example.skip.scheduler;


import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BannerWaitingToActiveScheduler {

    @Scheduled(cron = "0 0 2 * * SUN") // 매주 일요일 새벽 3시
    public void ToActive() {
        // 서비스 호출 or DB 갱신 로직
        System.out.println("⏰ 주간 데이터 갱신 작업 시작!");
        // 예: myService.updateWeeklyStats();
    }
}

