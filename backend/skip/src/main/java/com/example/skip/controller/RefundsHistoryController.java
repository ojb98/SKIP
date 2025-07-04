package com.example.skip.controller;


import com.example.skip.dto.UserDto;
import com.example.skip.dto.refund.RefundDetailDTO;
import com.example.skip.dto.refund.RefundSummaryDTO;
import com.example.skip.dto.request.RefundSearchRequest;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.enumeration.RefundStatus;
import com.example.skip.service.RefundsHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/refunds")
public class RefundsHistoryController {

    private final RefundsHistoryService refundsHistoryService;

    // 환불 목록 조회 (필터링 포함)
    @GetMapping("/manager/{userId}")
    public List<RefundSummaryDTO> getRefundList(
            @PathVariable Long userId,
            @RequestParam(required = false) Long rentId,
            @RequestParam(required = false) RefundStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
//            @RequestParam(defaultValue = "DESC") String sort
    ) {
        System.out.println("환불조회시 rentId ===> "+rentId);
        return refundsHistoryService.findRefunds(userId, rentId, status, startDate, endDate);
    }

    // 환불 상세 조회
    @GetMapping("/{refundId}/detail")
    public RefundDetailDTO getRefundDetail(@PathVariable Long refundId) {
        return refundsHistoryService.findRefundDetail(refundId);
    }

    // 사용자 환불 요청
    @PostMapping("/request/{rentItemId}")
    public ResponseEntity<String> requestRefund(@PathVariable Long rentItemId, @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        refundsHistoryService.requestRefund(rentItemId,reason);
        return ResponseEntity.ok("환불 요청 접수");
    }

    // 관리자 환불 승인
    @PatchMapping("/manager/{refundId}/approve")
    public ResponseEntity<String> approveRefund(@PathVariable Long refundId) {
        try {
            refundsHistoryService.approveRefund(refundId);
        } catch (IOException e) {
            System.out.println("controller환불승인실패");
            throw new RuntimeException(e);

        }
        return ResponseEntity.ok("환불 승인 완료");
    }

    // 관리자 환불 거절
    @PatchMapping("/manager/{refundId}/reject")
    public ResponseEntity<String> rejectRefund(@PathVariable Long refundId) {
        refundsHistoryService.rejectRefund(refundId);
        return ResponseEntity.ok("환불 승인 완료");
    }



    // 마이페이지 환불 내역
    @GetMapping("/search")
    public ApiResponse searchRefunds(RefundSearchRequest refundSearchRequest,
                                     @AuthenticationPrincipal UserDto userDto,
                                     @PageableDefault(page = 0, size = 5) Pageable pageable) {

        try {
            return ApiResponse.builder()
                    .success(true)
                    .data(refundsHistoryService.listRefunds(refundSearchRequest, userDto.getUserId(), pageable))
                    .build();
        } catch (Exception e) {
            e.printStackTrace();

            return ApiResponse.builder()
                    .success(false)
                    .data("내역을 조회하지 못했습니다.")
                    .build();
        }
    }
}
