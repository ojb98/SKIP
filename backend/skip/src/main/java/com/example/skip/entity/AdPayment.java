package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "AD_PAYMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AD_PAYMENT_ID", nullable = false)
    private Long adPaymentId;

    @Column(name = "RENT_ID", nullable = false)
    private Long rentId;

    @Column(name = "MERCHANT_UID", nullable = false, length = 100)
    private String merchantUid;

    @Column(name = "IMP_UID", nullable = false, length = 100)
    private String impUid;

    @Column(name = "TOTAL_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "METHOD", nullable = false, length = 20)
    private String method;

    @Column(name = "STATUS", nullable = false, length = 20)
    private String status;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;
}
