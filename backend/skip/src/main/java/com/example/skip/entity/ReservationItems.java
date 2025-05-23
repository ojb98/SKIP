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
public class ReservationItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rentItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="itemId", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="reserveId", nullable = false)
    private Reservations reservations;

    @Column(nullable = false)
    private LocalDateTime rentStart;

    @Column(nullable = false)
    private LocalDateTime rentEnd;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private Long subtotalPrice;
}
