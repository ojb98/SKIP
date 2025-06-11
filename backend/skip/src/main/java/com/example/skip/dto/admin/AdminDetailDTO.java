package com.example.skip.dto.admin;

import com.example.skip.enumeration.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDetailDTO {
    private Long paymentId;
    private String merchantUid;
    private String impUid;
    private String rentName;
    private String paymentUserId;
    private Double totalPrice;
    private Double commissionRate;
    private String method;
    private String pgProvider;
    private PaymentStatus status;
    private LocalDateTime createdAt;
}
