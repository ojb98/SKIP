package com.example.skip.controller.admin;

import com.example.skip.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<?> getSalesSummary(@RequestParam String startDate,
                                             @RequestParam String endDate) {
        return ResponseEntity.ok(adminDashboardService.getSummary(LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }

    
    @GetMapping("/sales-chart-data")
    public ResponseEntity<Map<String, Object>> getSalesChartData(
            @RequestParam(required = false) String atStart,
            @RequestParam(required = false) String atEnd) {
        Map<String, Object> data = adminDashboardService.getSalesChartData(atStart, atEnd);
        return ResponseEntity.ok(data);
    }
}
