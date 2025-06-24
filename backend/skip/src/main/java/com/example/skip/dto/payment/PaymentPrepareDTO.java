package com.example.skip.dto.payment;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class PaymentPrepareDTO {
    private Long userId;
    private List<ReservationItemDTO> reservationItems;

    @Data
    @Builder
    public static class ReservationItemDTO {
        private Long rentId;
        private Long itemDetailId;
        private String rentStart;
        private String rentEnd;
        private int quantity;
        private Long subtotalPrice;
    }
}
