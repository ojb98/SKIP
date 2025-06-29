package com.example.skip.scheduler;

import com.example.skip.service.RentSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RentSyncScheduler {
    private final RentSearchService rentSearchService;


    @Scheduled(cron = "0 0 11 * * *")
    public void syncUpdatedRents() {
        rentSearchService.syncRecentlyUpdated();
    }
}
