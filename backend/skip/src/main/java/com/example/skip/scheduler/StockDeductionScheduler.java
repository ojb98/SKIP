package com.example.skip.scheduler;

import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.ReservationItem;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.reservation.ReservationItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class StockDeductionScheduler {
    private final ReservationItemRepository reservationItemRepository;
    private final ItemDetailRepository itemDetailRepository;

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정 실행
    @Transactional
    public void processStockDeduction() {
        LocalDate today = LocalDate.now();
        log.info("재고 차감 스케줄러 시작 - {}", today);

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<ReservationItem> todayItems = reservationItemRepository.findAllByRentStartBetween(startOfDay, endOfDay);
        for (ReservationItem item : todayItems) {
            if (item.isStockDeducted()) {
                log.info("이미 재고 차감된 예약아이템 - ID: {}", item.getRentItemId());
                continue;
            }

            ItemDetail detail = itemDetailRepository.findByIdWithLock(item.getItemDetail().getItemDetailId())
                    .orElseThrow(() -> new IllegalArgumentException("아이템 상세 정보 없음"));

            int currentStock = detail.getStockQuantity();
            int quantityToDeduct = item.getQuantity();

            if (currentStock < quantityToDeduct) {
                log.error("재고 부족! ItemDetail ID: {}, 요청 수량: {}, 현재 재고: {}",
                        detail.getItemDetailId(), quantityToDeduct, currentStock);
                continue;
            }

            detail.setStockQuantity(currentStock - quantityToDeduct);
            item.setStockDeducted(true);
            reservationItemRepository.save(item);
            log.info("재고 차감 완료 - ItemDetail ID: {}, 차감 수량: {}", detail.getItemDetailId(), quantityToDeduct);
        }

        log.info("재고 차감 스케줄러 종료");
    }
}
