package com.example.skip.controller;


import com.example.skip.service.RefundsHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/refunds")
public class RefundsHistoryController {

    private final RefundsHistoryService refundsHistoryService;

    // 사용자 환불 요청
    @PostMapping("/request")
    public ResponseEntity<String> requestRefund(@RequestParam Long rentItemId, @RequestParam String reason) {
        refundsHistoryService.requestRefund(rentItemId,reason);
        return ResponseEntity.ok("환불 요청 접수");
    }

    // 관리자 환불 승인
    @PostMapping("/manager/{refundId}")
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
