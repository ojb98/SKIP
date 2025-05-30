package com.example.skip.dto;

import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Reservations;
import com.example.skip.entity.ReservationItems;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ReservationItemsDTO {
    private Long rentItemId;
    private Long itemDetailId;
    private Long reserveId;
    private LocalDateTime rentStart;
    private LocalDateTime rentEnd;
    private int quantity;
    private Long subtotalPrice;

    // Entity → DTO 변환 생성자
    public ReservationItemsDTO(ReservationItems reservationItem) {
        this.rentItemId = reservationItem.getRentItemId();
        this.itemDetailId = reservationItem.getItemDetail().getItemDetailId();
        this.reserveId = reservationItem.getReservations().getReserveId();
        this.rentStart = reservationItem.getRentStart();
        this.rentEnd = reservationItem.getRentEnd();
        this.quantity = reservationItem.getQuantity();
        this.subtotalPrice = reservationItem.getSubtotalPrice();
    }

    // DTO → Entity 변환 메서드
    public ReservationItems toEntity(ItemDetail itemDetail, Reservations reservations) {
        return ReservationItems.builder()
                .rentItemId(rentItemId)
                .itemDetail(itemDetail)
                .reservations(reservations)
                .rentStart(rentStart)
                .rentEnd(rentEnd)
                .quantity(quantity)
                .subtotalPrice(subtotalPrice)
                .build();
    }
}
