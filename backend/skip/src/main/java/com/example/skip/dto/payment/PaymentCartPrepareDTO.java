package com.example.skip.dto.payment;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PaymentCartPrepareDTO {
    private Long userId;
    private List<CartReservationItemDTO> reservationItems;

    @Data
    public static class CartReservationItemDTO {
        private Long cartId;
        private Long rentId;
        private String rentStart;
        private String rentEnd;
        private int quantity;
        private long subtotalPrice;
    }
}
