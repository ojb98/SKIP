package com.example.skip.entity;

import com.example.skip.enumeration.RefundStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class RefundsHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refundId;

    @ManyToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rentItemId", nullable = false)
    private ReservationItem reservationItem;

    @Column(nullable = false)
    private Double refundPrice;

    @Column(nullable = false)
    private Double adminRefundPrice;

    @Column(nullable = false)
    private Double rentRefundPrice;

    @Column(length = 200)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RefundStatus status= RefundStatus.REQUESTED;

    private LocalDateTime refundedAt;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;
}