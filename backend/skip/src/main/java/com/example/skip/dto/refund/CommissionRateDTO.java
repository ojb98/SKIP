package com.example.skip.dto.refund;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 결제 금액을 기준으로 관리자 수수료와 렌탈샵 수익을 계산하기 위한 DTO
public class CommissionRateDTO {
    private Long reserveId;
    private Double totalPrice;
    private Double adminFee;
    private Double rentFee;

    private static final double COMMISSION_RATE = 0.1;

    public CommissionRateDTO(Long reserveId, Double totalPrice) {
        this.reserveId = reserveId;
        this.totalPrice = totalPrice;
        this.adminFee = totalPrice * COMMISSION_RATE;  //총 금액의 10%
        this.rentFee = totalPrice * (1 - COMMISSION_RATE);  //총 금액의 90%
    }
}
