package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long reserveId;
    private Long userId;
    private Long rentId;
    private Long totalPrice;
    private LocalDateTime createdAt;
    private String merchantUid;   // 아임포트 주문번호
    private String impUid;        // 아임포트 결제 고유번호
    private List<ReservationItemDTO> reservationItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationItemDTO{
        private Long cartItemId;
        private LocalDateTime rentStart;
        private LocalDateTime rentEnd;
        private int quantity;
        private Long subtotalPrice;
    }
}
