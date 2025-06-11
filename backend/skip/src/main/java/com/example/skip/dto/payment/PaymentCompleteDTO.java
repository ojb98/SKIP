package com.example.skip.dto.payment;

import lombok.Data;

import java.util.List;

@Data
public class PaymentCompleteDTO {
    private String impUid;
    private String merchantUid;
    private Long amount;  //실제 아임포트 결제금액
    private Long userId;
    private Long totalPrice;   // 프론트 계산된 전체 금액

    private List<ReservationItemDTO> reservationItems;

    @Data
    public static class ReservationItemDTO {
        private Long cartItemId;
        private Long rentId;
        private String rentStart;
        private String rentEnd;
        private int quantity;
        private Long subtotalPrice;
    }
}
