package com.example.skip.scheduler;

import com.example.skip.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class CartCleanupScheduler {

    private final CartItemRepository cartItemRepository;

    @Scheduled(cron = "0 0 3 * * *")
    public void deleteOldCartItems(){
        LocalDateTime weekAgo = LocalDate.now().minusDays(7).atStartOfDay();
        int deletedCount = cartItemRepository.deleteByCreatedAtBefore(weekAgo);
        log.info("[장바구니 정리] {}개 항목 삭제됨 (기준일: {})", deletedCount, weekAgo);
    }
}
