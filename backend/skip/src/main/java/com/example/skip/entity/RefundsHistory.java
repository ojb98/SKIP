package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundsHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refundId;

    @ManyToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(nullable = false)
    private Double refundPrice;

    @Column(nullable = false)
    private Double adminRefundPrice;

    @Column(nullable = false)
    private Double rentRefundPrice;

    @Column(length = 200)
    private String reason;

    @Column(length = 20)
    private String status;

    private LocalDateTime refundedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
