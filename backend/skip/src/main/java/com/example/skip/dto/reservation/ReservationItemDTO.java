package com.example.skip.dto.reservation;

import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ReservationItemDTO {
    private Long rentItemId;
    private Long itemDetailId;
    private Long reserveId;
    private LocalDateTime rentStart;
    private LocalDateTime rentEnd;
    private int quantity;
    private Long subtotalPrice;

    // Entity → DTO 변환 생성자
    public ReservationItemDTO(ReservationItem reservationItem) {
        this.rentItemId = reservationItem.getRentItemId();
        this.itemDetailId = reservationItem.getItemDetail().getItemDetailId();
        this.reserveId = reservationItem.getReservation().getReserveId();
        this.rentStart = reservationItem.getRentStart();
        this.rentEnd = reservationItem.getRentEnd();
        this.quantity = reservationItem.getQuantity();
        this.subtotalPrice = reservationItem.getSubtotalPrice();
    }

    // DTO → Entity 변환 메서드
    public ReservationItem toEntity(ItemDetail itemDetail, Reservation reservations) {
        return ReservationItem.builder()
                .rentItemId(rentItemId)
                .itemDetail(itemDetail)
                .reservation(reservations)
                .rentStart(rentStart)
                .rentEnd(rentEnd)
                .quantity(quantity)
                .subtotalPrice(subtotalPrice)
                .build();
    }
}
