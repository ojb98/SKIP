package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentIamPortDTO {
    private Double amount;
    private String payMethod;
    private String pgProvider;
}
