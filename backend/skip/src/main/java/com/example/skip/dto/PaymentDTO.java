package com.example.skip.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.example.skip.entity.Payment;
import com.example.skip.enumeration.PaymentStatus;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class PaymentDTO {
    private Long paymentId;
    private Long reservationId;
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


    public PaymentDTO(Payment payment) {
        this.paymentId = payment.getPaymentId();
        if (payment.getReservations() != null) {
            this.reservationId = payment.getReservations().getReserveId();
        }
        this.merchantUid = payment.getMerchantUid();
        this.impUid = payment.getImpUid();
        this.totalPrice = payment.getTotalPrice();
        this.commissionRate = payment.getCommissionRate();
        this.adminPrice = payment.getAdminPrice();
        this.rentPrice = payment.getRentPrice();
        this.method = payment.getMethod();
        this.pgProvider = payment.getPgProvider();
        this.status = payment.getStatus();
        this.createdAt = payment.getCreatedAt();
        this.refundIds = payment.getRefunds() != null
                ? payment.getRefunds().stream().map(r -> r.getRefundId()).collect(Collectors.toList())
                : List.of();
    }
}