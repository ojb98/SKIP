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
    private List<Long> cartIds;
    private List<ReservationItemDTO> reservationItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationItemDTO{
        private Long itemDetailId;
        private LocalDateTime rentStart;
        private LocalDateTime rentEnd;
        private int quantity;
        private Long subtotalPrice;
    }
}
