package com.example.skip.dto.payment;

import com.example.skip.enumeration.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWithReservationsDto {
    private Long paymentId;

    private String merchantUid;

    private String impUid;

    private Double totalPrice;

    private Double commissionRate;

    private Double adminPrice;

    private Double rentPrice;

    private String method;

    private String pgProvider;

    private PaymentStatus status;

    private LocalDateTime createdAt;

    private List<Long> refundIds;
}
