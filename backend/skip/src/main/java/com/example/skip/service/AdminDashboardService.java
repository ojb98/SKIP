package com.example.skip.service;

import com.example.skip.entity.Payment;
import com.example.skip.repository.AdPaymentRepository;
import com.example.skip.repository.PaymentRepository;
import com.example.skip.repository.RefundsHistoryRepository;
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
    private RefundsHistoryRepository refundsHistoryRepository;

    @Autowired
    private AdPaymentRepository adPaymentRepository;

    public Map<String, Object> getSummary(LocalDate start, LocalDate end) {
        List<Payment> payments = paymentRepository.findAllByCreatedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());

        double total = payments.stream().mapToDouble(Payment::getTotalPrice).sum();
        double profit = payments.stream().mapToDouble(Payment::getAdminPrice).sum();
        long successCount = payments.stream().filter(p -> p.getStatus().equals("SUCCESS")).count();
        long cancelCount = payments.stream().filter(p -> p.getStatus().equals("CANCEL")).count();

        Map<String, Object> result = new HashMap<>();
        result.put("totalSales", total);
        result.put("netProfit", profit);
        result.put("successCount", successCount);
        result.put("cancelCount", cancelCount);
        System.out.println("✔ successCount = " + successCount);
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
