package com.example.skip.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationWithItemsDto {
    private Long reserveId;

    private Long userId;

    private Long rentId;

    private Long paymentId;

    private Long totalPrice;

    private LocalDateTime createdAt;

    private String merchantUid;   // 아임포트 주문번호

    private String impUid;        // 아임포트 결제 고유번호

    private List<ReservationItemDTO> reservationItems;
}
