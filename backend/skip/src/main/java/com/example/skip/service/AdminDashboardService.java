package com.example.skip.service;

import com.example.skip.entity.*;
import com.example.skip.enumeration.PaymentStatus;
import com.example.skip.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public Map<String, Object> getSummary(LocalDate start, LocalDate end) {
        List<Payment> payments = paymentRepository.findAllByCreatedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        List<AdPayment> adPayments = adPaymentRepository.findAllByCreatedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        List<ActiveBannerList> activeBannerList = activeBannerListRepository.findAllByUploadDateBetween(start.atStartOfDay(),end.plusDays(1).atStartOfDay());
        List<BannerWaitingList> watingBannerList = bannerWaitingListRepository.findAllByCreatedAtBetween(start.atStartOfDay(),end.plusDays(1).atStartOfDay());
        List<Boost> boostList = boostRepository.findAllByEndDateBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());

        // 총 결제액 : 렌탈샵 매출액 + 광고비 매출액
        double total = payments.stream().mapToDouble(Payment::getTotalPrice).sum() + adPayments.stream().mapToDouble(AdPayment::getTotalPrice).sum();
        // 총 결제건 : 렌탈샵 매출건 + 광고비 매출건
        long totalSalesCount = payments.stream().count() + adPayments.stream().count();
        // 렌탈샵 매출액 , 광고비 매출액
        double rentTotalSales = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PAID)
                .mapToDouble(Payment::getTotalPrice)
                .sum();
        double adTotalSales = adPayments.stream().mapToDouble(AdPayment::getTotalPrice).sum();
        // 렌탈샵 매출건 , 광고비 매출건
        long rentTotalAmounts = payments.stream().filter(p -> p.getStatus() == PaymentStatus.PAID).count();
        long adTotalAmounts = adPayments.stream().count();
        // 관리자 순수익액
        double profit = payments.stream().filter(p -> p.getStatus() == PaymentStatus.PAID).mapToDouble(Payment::getAdminPrice).sum();
        // 결제승인건
        long successCount = payments.stream().filter(p -> p.getStatus() == PaymentStatus.PAID).count();
        // 결제취소금액
        double cancelPrice = payments.stream().filter(p -> p.getStatus() == PaymentStatus.CANCELLED).mapToDouble(Payment::getTotalPrice).sum();
        // 결제취소건
        long cancelCount = payments.stream().filter(p -> p.getStatus() == PaymentStatus.CANCELLED).count();

        // 광고결제건수
        long adCount = activeBannerList.stream().count() + boostList.stream().count();
        // 대기중인 배너등록요청 건 수
        long bannerWaitingCount = watingBannerList.stream().count();

        Map<String, Object> result = new HashMap<>();
        result.put("totalSales", total);
        result.put("totalSalesCount", totalSalesCount);
        result.put("totalAdCount", adCount);
        result.put("totalProfit", profit);
        result.put("totalSuccessCount", successCount);
        result.put("totalCancelPrice", cancelPrice);
        result.put("totalCancelCount", cancelCount);
//        result.put("totalPendingCount", pendingCount);
        result.put("totalRentPrice", rentTotalSales);
        result.put("totalRentAmount", rentTotalAmounts);
        result.put("totalAdPrice", adTotalSales);
        result.put("totalAdAmount", adTotalAmounts);
        result.put("totalBannerWaiting", bannerWaitingCount);
        return result;
    }

    public Map<String, Object> getSalesChartData(String atStart, String atEnd) {
        Map<String, Object> data = new HashMap<>();

        // 기본 날짜 범위 설정
        if (atStart == null || atStart.isEmpty()) {
            atStart = LocalDate.now().minusDays(14).toString();
        }
        if (atEnd == null || atEnd.isEmpty()) {
            atEnd = LocalDate.now().plusDays(14).toString();
        }

        LocalDateTime startDateTime = LocalDate.parse(atStart).atStartOfDay();
        LocalDateTime endDateTime = LocalDate.parse(atEnd).plusDays(1).atStartOfDay();

        List<Map<String, Object>> dailySales = paymentRepository.getDailySales(startDateTime, endDateTime);
        List<Map<String, Object>> categorySales = paymentRepository.getCategorySales(startDateTime, endDateTime);

        data.put("dailySales", dailySales);
        data.put("categorySales", categorySales);
        data.put("atStart", atStart);
        data.put("atEnd", atEnd);

        return data;
    }
}
