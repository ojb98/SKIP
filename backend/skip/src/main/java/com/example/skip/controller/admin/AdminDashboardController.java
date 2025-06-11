package com.example.skip.controller.admin;

import com.example.skip.service.AdminDashboardService;
import com.example.skip.service.AdminExcelExportService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {
    @Autowired
    private AdminDashboardService adminDashboardService;
    @Autowired
    private AdminExcelExportService adminExcelExportService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        Map<String, Object> summary = adminDashboardService.getSummary(start, end);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("summary/export")
    public void exportSalesToExcel(
            @RequestParam("extension") String extension,
            @RequestParam("atStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("atEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            HttpServletResponse response
    ) throws IOException {
        String fileName = "매출전표_" + start + "_" + end + extension;
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+","%20");
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFileName);

        String startStr = start.toString();
        String endStr = end.toString();

        adminExcelExportService.writeAdminExcel(response.getOutputStream(), startStr, endStr);
    }

    @GetMapping("/sales/list")
    public ResponseEntity<List<?>> getSalesList(
            @RequestParam("atStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("atEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
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
