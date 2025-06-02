package com.example.skip.dto;

import lombok.Data;

import java.util.List;

@Data
public class PaymentCompleteDTO {
    private String impUid;
    private String merchantUid;
    private Long amount;  //실제 아임포트 결제금액이 일치하는지 검증

    private Long userId;
    private Long rentId;
    private Long totalPrice;

    private List<ReservationItemDTO> reservationItems;

    @Data
    public static class ReservationItemDTO {
        private Long cartItemId;
        private String rentStart;
        private String rentEnd;
        private int quantity;
        private Long subtotalPrice;
    }
}

