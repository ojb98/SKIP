package com.example.skip.service;

import com.example.skip.repository.AdPaymentRepository;
import com.example.skip.repository.PaymentRepository;
import com.example.skip.repository.RefundsHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDashboardService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RefundsHistoryRepository refundsHistoryRepository;

    @Autowired
    private AdPaymentRepository adPaymentRepository;

    public Map<String, Object> getSalesSummary(String atStart, String atEnd) {
        Map<String, Object> data = new HashMap<>();

        // 기본 날짜 범위 설정
        if (atStart == null || atStart.isEmpty()) {
            atStart = LocalDate.now().minusDays(14).toString();
        }
        if (atEnd == null || atEnd.isEmpty()) {
            atEnd = LocalDate.now().plusDays(14).toString();
        }

        // 총 매출, 예약 완료, 취소 건수
        Long totalSales = paymentRepository.getTotalSales(atStart, atEnd);
        Long confirmReserv = paymentRepository.getConfirmReserv(atStart, atEnd);
        Long cancleReserv = paymentRepository.getCancleReserv(atStart, atEnd);

        data.put("totalSales", totalSales);
        data.put("confirmReserv", confirmReserv);
        data.put("cancleReserv", cancleReserv);
        data.put("atStart", atStart);
        data.put("atEnd", atEnd);

        return data;
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

        // 날짜별 매출 (라인 차트)
        List<Map<String, Object>> dailySales = paymentRepository.getDailySales(atStart, atEnd);

        // 상품별 매출 (도넛 차트)
        List<Map<String, Object>> categorySales = paymentRepository.getCategorySales(atStart, atEnd);

        data.put("dailySales", dailySales);
        data.put("categorySales", categorySales);
        data.put("atStart", atStart);
        data.put("atEnd", atEnd);

        return data;
    }
}
