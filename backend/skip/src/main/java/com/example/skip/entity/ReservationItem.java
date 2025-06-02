package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = {"item", "reservations"})
@Builder
public class ReservationItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rentItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="itemDetailId", nullable = false)
    private ItemDetail itemDetail;

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


}