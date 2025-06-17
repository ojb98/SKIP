package com.example.skip.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDirectDTO {
    private String impUid;
    private String merchantUid;
    private Long amount;
    private Long userId;
    private Long totalPrice;
    private String pgProvider;
    private List<ReservationItemDTO> reservationItems;

    @Data
    public static class ReservationItemDTO {
        private Long rentId;
        private Long itemDetailId;
        private String rentStart;
        private String rentEnd;
        private int quantity;
        private Long subtotalPrice;
    }
}
