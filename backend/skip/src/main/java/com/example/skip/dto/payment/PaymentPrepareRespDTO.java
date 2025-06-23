package com.example.skip.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PaymentPrepareRespDTO {
    private String merchantUid;
    private Long totalPrice;
}
