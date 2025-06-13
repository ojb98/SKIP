package com.example.skip.controller;


import com.example.skip.dto.refund.RefundDetailDTO;
import com.example.skip.dto.refund.RefundSummaryDTO;
import com.example.skip.enumeration.RefundStatus;
import com.example.skip.service.RefundsHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/refunds")
public class RefundsHistoryController {

    private final RefundsHistoryService refundsHistoryService;

    // 환불 목록 조회 (필터링 포함)
    @GetMapping("/manager")
    public List<RefundSummaryDTO> getRefundList(
            @RequestParam Long userId,
            @RequestParam(required = false) Long rentId,
            @RequestParam(required = false) RefundStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "DESC") String sort
    ) {
        System.out.println("환불조회시 rentId ===> "+rentId);
        return refundsHistoryService.findRefunds(userId, rentId, status, startDate, endDate, sort);
    }

    // 환불 상세 조회
    @GetMapping("/{refundId}/detail")
    public RefundDetailDTO getRefundDetail(@PathVariable Long refundId) {
        return refundsHistoryService.findRefundDetail(refundId);
    }

    // 사용자 환불 요청
    @PostMapping("/request")
    public ResponseEntity<String> requestRefund(@RequestParam Long rentItemId, @RequestParam String reason) {
        refundsHistoryService.requestRefund(rentItemId,reason);
        return ResponseEntity.ok("환불 요청 접수");
    }

    // 관리자 환불 승인
    @PatchMapping("/manager/{refundId}")
    public ResponseEntity<String> approveRefund(@PathVariable Long refundId) {
        try {
            refundsHistoryService.approveRefund(refundId);
        } catch (IOException e) {
            System.out.println("controller환불실패");
            throw new RuntimeException(e);

        }
        return ResponseEntity.ok("환불 승인 완료");
    }
}
