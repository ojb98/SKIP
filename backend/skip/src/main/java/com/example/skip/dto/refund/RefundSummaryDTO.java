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
public class RefundSummaryDTO {
    private Long refundId;
    private Long reserveId;
    private String merchantUid;
    private Long rentId;
    private String rentName;
    private String itemName;
    private int quantity;
    private Double refundPrice;
    private RefundStatus status;
    private LocalDateTime createdAt;

}
