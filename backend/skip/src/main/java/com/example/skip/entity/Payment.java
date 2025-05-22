package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private Long reserveId;

    @Column(nullable = false, length = 100)
    private String merchantUid;

    @Column(nullable = false, length = 100)
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

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    private List<RefundsHistory> refunds;
}
