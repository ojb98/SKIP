package com.example.skip.dto.payment;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PaymentConfirmDTO {
    private String impUid;
    private String merchantUid;
    private Long amount;
}
