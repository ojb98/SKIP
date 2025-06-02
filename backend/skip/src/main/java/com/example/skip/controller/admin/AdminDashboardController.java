package com.example.skip.controller.admin;

import com.example.skip.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        Map<String, Object> summary = adminDashboardService.getSummary(start, end);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/sales/list")
    public ResponseEntity<List<?>> getSalesList(
            @RequestParam("atStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("atEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
//        // startDate와 endDate를 이용해 서비스에서 매출 리스트 가져오기
//        List<SalesDto> sales = salesService.getSalesBetween(startDate, endDate);
        List<?> list= null;
        return ResponseEntity.ok(list);

    }

    @GetMapping("/sales/chart")
    public ResponseEntity<List<Map<String, Object>>> getSalesChartData(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<Map<String, Object>> data = adminDashboardService.getSalesChartData(start, end);
        System.out.println(start);
        System.out.println(end);
        System.out.println(data);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/sales/today")
    public ResponseEntity<Map<String, Object>> getStatOverviewCard(@RequestParam String todaysDate){
        return ResponseEntity.ok(adminDashboardService.getSummary(LocalDate.parse(todaysDate), LocalDate.parse(todaysDate)));
    }


}
