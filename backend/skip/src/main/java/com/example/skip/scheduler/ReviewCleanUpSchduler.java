package com.example.skip.scheduler;

import com.example.skip.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReviewCleanUpSchduler {

    private final ReviewRepository reviewRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanUpOldReview() {
        LocalDateTime cutoff = LocalDateTime.now().minusMonths(3);
        int count = reviewRepository.deleteByCreatedAtBefore(cutoff);
        log.info("[Review Scheduler] {}건의 Review 삭제 완료 (기준: {})",count, cutoff);
    }
}
