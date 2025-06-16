package com.example.skip.service;

import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.PaymentRepository;
import com.example.skip.repository.reservation.ReservationItemRepository;
import com.example.skip.repository.reservation.ReservationRepository;
import com.example.skip.repository.RentRepository;
import com.example.skip.entity.Rent;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class RentDashboardService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private ReservationItemRepository reservationItemRepository;
    @Autowired
    private RentRepository rentRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    public Map<String, Object> getSummary(Long userId, LocalDate start, LocalDate end) {
        LocalDateTime from = start.atStartOfDay();
        LocalDateTime to = end.plusDays(1).atStartOfDay();

        double totalSales = Optional.ofNullable(paymentRepository.getTotalPaidPriceByUser(userId, from, to)).orElse(0.0)
                + Optional.ofNullable(paymentRepository.getCancelledSalesByUser(userId, from, to)).orElse(0.0);
        long totalSalesCount = Optional.ofNullable(paymentRepository.getPaidCountByUser(userId, from, to)).orElse(0L)
                + Optional.ofNullable(paymentRepository.getCancelledCountByUser(userId, from, to)).orElse(0L);
        double profit = Optional.ofNullable(paymentRepository.getRentProfitByUser(userId, from, to)).orElse(0.0);
        long successCount = Optional.ofNullable(paymentRepository.getPaidCountByUser(userId, from, to)).orElse(0L);
        double cancelPrice = Optional.ofNullable(paymentRepository.getCancelledSalesByUser(userId, from, to)).orElse(0.0);
        long cancelCount = Optional.ofNullable(paymentRepository.getCancelledCountByUser(userId, from, to)).orElse(0L);

        int totalAdCash = rentRepository
                .findByUser_UserIdAndUseYn(userId, YesNo.Y, Sort.unsorted())
                .stream()
                .mapToInt(Rent::getRemainAdCash)
                .sum();

        long reservationCount = reservationRepository.countByRent_User_UserId(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("totalSales", totalSales);
        result.put("totalSalesCount", totalSalesCount);
        result.put("totalProfit", profit);
        result.put("totalSuccessCount", successCount);
        result.put("totalCancelPrice", cancelPrice);
        result.put("totalCancelCount", cancelCount);
        result.put("totalAdCash", totalAdCash);
        result.put("reservationCount", reservationCount);
        return result;
    }

    public List<Map<String, Object>> getSalesChartData(Long userId, LocalDate start, LocalDate end) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (ItemCategory category : ItemCategory.values()) {
            long count = reservationItemRepository.countPaymentsByUserAndItemCategory(
                    userId,
                    category,
                    start.atStartOfDay(),
                    end.plusDays(1).atStartOfDay()
            );
            Map<String, Object> map = new HashMap<>();
            map.put("category", category.toString());
            map.put("count", count);
            result.add(map);
        }
        return result;
    }
}