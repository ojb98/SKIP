package com.example.skip.service;

import com.example.skip.entity.*;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.PaymentStatus;
import com.example.skip.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminDashboardService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private AdPaymentRepository adPaymentRepository;
    @Autowired
    private ActiveBannerListRepository activeBannerListRepository;
    @Autowired
    private BannerWaitingListRepository bannerWaitingListRepository;
    @Autowired
    private BoostRepository boostRepository;
    @Autowired
    private ReservationItemsRepository reservationItemsRepository;

    // ***DB에서 가공된 결과 가져오기
    public Map<String, Object> getSummary(LocalDate start, LocalDate end) {
        LocalDateTime from = start.atStartOfDay();
        LocalDateTime to = end.plusDays(1).atStartOfDay();

        // 총 결제액, 총 결제건 수
        double totalSales = Optional.ofNullable(paymentRepository.getTotalPaidPriceBetween(from, to)).orElse(0.0)
                            +Optional.ofNullable(paymentRepository.getCancelledSales(from, to)).orElse(0.0);
        long totalSalesCount =  Optional.ofNullable(paymentRepository.getPaidCountBetween(from, to)).orElse(0L)
                                +Optional.ofNullable(paymentRepository.getCancelledCount(from, to)).orElse(0L);
        // 렌탈샵 총 결제액 , 광고비 총 결제액
        double rentTotalSales = Optional.ofNullable(paymentRepository.getRentTotalSales(from, to)).orElse(0.0);
        double adTotalSales = Optional.ofNullable(paymentRepository.getAdTotalSales(from, to)).orElse(0.0);
        // 렌탈샵 매출건 , 광고비 매출건
        long rentTotalCount = Optional.ofNullable(paymentRepository.getRentTotalCount(from, to)).orElse(0L);
        long adTotalCount = Optional.ofNullable(paymentRepository.getAdTotalCount(from, to)).orElse(0L);
        // 광고 신청건
        long adAmount = Optional.ofNullable(paymentRepository.countBanner(from,to)).orElse(0L)
                        + Optional.ofNullable(paymentRepository.countBoost(from,to)).orElse(0L);


        // 관리자 순수익액
        double profit = Optional.ofNullable(paymentRepository.getAdminProfit(from, to)).orElse(0.0);
        // 결제승인건
        long successCount = Optional.ofNullable(paymentRepository.getPaidCountBetween(from, to)).orElse(0L);
                            //- Optional.ofNullable(paymentRepository.getCancelledCount(from, to)).orElse(0L);
        // 결제취소금액, 결제취소건
        double cancelPrice = Optional.ofNullable(paymentRepository.getCancelledSales(from, to)).orElse(0.0);
        long cancelCount = Optional.ofNullable(paymentRepository.getCancelledCount(from, to)).orElse(0L);
        // 대기중인 배너등록요청 건 수
        long bannerWaitingCount = Optional.ofNullable(paymentRepository.getBannerWaitingCount(from, to)).orElse(0L);

        Map<String, Object> result = new HashMap<>();
        result.put("totalSales", totalSales);
        result.put("totalSalesCount", totalSalesCount);
        result.put("totalAdCount", adTotalCount);
        result.put("totalAdPrice", adTotalSales);
        result.put("totalProfit", profit);
        result.put("totalSuccessCount", successCount);
        result.put("totalCancelPrice", cancelPrice);
        result.put("totalCancelCount", cancelCount);
        result.put("totalAdAmount", adAmount);
        result.put("totalRentPrice", rentTotalSales);
        result.put("totalRentAmount", rentTotalCount);
        result.put("totalBannerWaiting", bannerWaitingCount);
        return result;
    }

    //ItemCategory enum클래스의 인자 순서대로 순회하며 Map에 담기
    public List<Map<String, Object>> getSalesChartData(LocalDate start, LocalDate end) {
        List<Map<String, Object>> result = new ArrayList<>();

        for (ItemCategory category: ItemCategory.values()) {
            long count = reservationItemsRepository.countPaymentsByItemCategory(
                    category,
                    start.atStartOfDay(),
                    end.plusDays(1).atStartOfDay()
            );
            Map<String, Object> map = new HashMap<>();
            map.put("category",category.toString());
            map.put("count",count);
            result.add(map);
        };
        System.out.println(result);
        return result;
    }
}
