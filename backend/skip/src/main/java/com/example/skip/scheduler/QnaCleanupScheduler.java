package com.example.skip.scheduler;

import com.example.skip.repository.QnaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class QnaCleanupScheduler {

    private final QnaRepository qnaRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanUpOldQna() {
        LocalDateTime cutoff = LocalDateTime.now().minusMonths(3);
        int count = qnaRepository.deleteByCreatedAtBefore(cutoff);
        log.info("[QNA Scheduler] {}건의 Q&A 삭제 완료 (기준: {})", count, cutoff);

    }
}
