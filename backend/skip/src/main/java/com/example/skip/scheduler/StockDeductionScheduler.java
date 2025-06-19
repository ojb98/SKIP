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
        log.info("재고 차감 스케줄러 시작 - {}", today);  //시작 로그 출력

        //00:00 ~ 24:00
        LocalDateTime startOfDay = today.atStartOfDay();   // 오늘 00:00
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();  // 내일 00:00

        // 오늘부터 대여가 시작되는 예약 아이템 조회
        List<ReservationItem> todayItems = reservationItemRepository.findAllByRentStartBetween(startOfDay, endOfDay);
        for (ReservationItem item : todayItems) {
            if (item.isStockDeducted()) {  //중복 차감 방지
                // 스케줄러 전체를 멈추지 않고, 문제가 있는 항목만 넘김
                log.info("이미 재고 차감된 예약아이템 - ID: {}", item.getRentItemId());
                continue;
            }

            //스케줄러가 자정에 재고를 차감하는 중에, 다른 사용자가 웹에서 같은 상품을 예약할 수 있기때문에 락걸어줌
            ItemDetail detail = itemDetailRepository.findByIdWithLock(item.getItemDetail().getItemDetailId())
                    .orElseThrow(() -> new IllegalArgumentException("아이템 상세 정보 없음"));

            // 해당 상품의 현재 보유 재고 수량
            int currentStock = detail.getStockQuantity();
            // 사용자가 예약에서 요청한 수량
            int quantityToDeduct = item.getQuantity();

            if (currentStock < quantityToDeduct) {
                //스케줄러 전체를 멈추지 않고, 문제가 있는 항목만 넘김
                log.error("재고 부족! ItemDetail ID: {}, 요청 수량: {}, 현재 재고: {}",
                        detail.getItemDetailId(), quantityToDeduct, currentStock);
                continue;
            }

            // 실제 재고 차감
            detail.setStockQuantity(currentStock - quantityToDeduct);
            item.setStockDeducted(true);   // 재고가 이미 차감되었음을 표시
            reservationItemRepository.save(item);
            log.info("재고 차감 완료 - ItemDetail ID: {}, 차감 수량: {}", detail.getItemDetailId(), quantityToDeduct);
        }
        // 전체 프로세스 종료 로그
        log.info("재고 차감 스케줄러 종료");
    }
}
