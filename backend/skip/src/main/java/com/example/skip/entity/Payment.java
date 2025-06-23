package com.example.skip.entity;

import com.example.skip.enumeration.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Builder.Default
    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();

    @Column(nullable = false, length = 100)
    private String merchantUid;

    @Column(nullable = true, length = 100)
    private String impUid;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(nullable = false)
    private Double commissionRate;

    @Column(nullable = false)
    private Double adminPrice;

    @Column(nullable = false)
    private Double rentPrice;

    private String method;

    private String pgProvider;

    @Column(length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    private List<RefundsHistory> refunds;
}