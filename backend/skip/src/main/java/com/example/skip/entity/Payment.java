package com.example.skip.entity;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    private Long paymentId;

    private Reservation reservation;

    private String merchantUid;

    private String impUid;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalPrice;


}
