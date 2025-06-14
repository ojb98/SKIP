package com.example.skip.dto.refund;

import com.example.skip.enumeration.RefundStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefundDetailDTO {
    private Long refundId;

    // 환불 정보
    private Double refundPrice;
    private Double adminRefundPrice;
    private Double rentRefundPrice;
    private String reason;
    private RefundStatus status;
    private LocalDateTime refundedAt;
    private LocalDateTime createdAt;

    // 결제 정보
    private Long paymentId;
    private Double totalPaymentPrice;

    // 예약 정보
    private Long reserveId;
    private String userName;
    private String userEmail;

    // 아이템 정보
    private Long rentItemId;
    private String itemName;
    private int quantity;
    private LocalDateTime rentStart;
    private LocalDateTime rentEnd;
}
