package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = {"itemDetail", "reservation"})
@Builder
public class ReservationItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rentItemId;

    // 대여할 아이템 상세 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="itemDetailId", nullable = false)
    private ItemDetail itemDetail;

    // 예약 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="reserveId", nullable = false)
    private Reservation reservation;

    @Column(nullable = false)
    private LocalDateTime rentStart;

    @Column(nullable = false)
    private LocalDateTime rentEnd;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private Long subtotalPrice;

    @Column(nullable = false)
    private boolean isReturned = false;

}