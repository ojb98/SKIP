package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionRateDTO {
    private Long reserveId;
    private Double totalPrice;
    private Double adminFee;
    private Double rentFee;

    private static final double COMMISSION_RATE = 0.1;

    public CommissionRateDTO(Long reserveId, Double totalPrice) {
        this.reserveId = reserveId;
        this.totalPrice = totalPrice;
        this.adminFee = totalPrice * COMMISSION_RATE;
        this.rentFee = totalPrice * (1 - COMMISSION_RATE);
    }
}
