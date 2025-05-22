package com.example.skip.dto;

import com.example.skip.entity.Item;
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
    private Long itemId;
    private Long reserveId;
    private LocalDateTime rentStart;
    private LocalDateTime rentEnd;
    private int quantity;
    private Long subtotalPrice;

    public ReservationItemsDTO(ReservationItems reservationItem) {
        this.rentItemId = reservationItem.getRentItemId();
        this.itemId = reservationItem.getItem().getItemId();
        this.reserveId = reservationItem.getReservations().getReserveId();
        this.rentStart = reservationItem.getRentStart();
        this.rentEnd = reservationItem.getRentEnd();
        this.quantity = reservationItem.getQuantity();
        this.subtotalPrice = reservationItem.getSubtotalPrice();
    }

    public ReservationItems toEntity(Item item, Reservations reservations) {
        ReservationItems reservationItem = com.example.skip.entity.ReservationItems.builder()
                .rentItemId(rentItemId)
                .item(item)
                .reservations(reservations)
                .rentStart(rentStart)
                .rentEnd(rentEnd)
                .quantity(quantity)
                .subtotalPrice(subtotalPrice)
                .build();
        return reservationItem;
    }
}
