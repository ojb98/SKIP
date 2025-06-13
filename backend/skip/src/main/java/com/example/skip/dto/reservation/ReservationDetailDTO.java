package com.example.skip.dto.reservation;

import com.example.skip.entity.Item;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.enumeration.ReservationStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDetailDTO {
    private Long reserveId;
    private Long rentItemId;
    private String name;
    private String size;
    private int quantity;
    private LocalDateTime rentStart;
    private LocalDateTime rentEnd;
    private int price;
    private boolean isReturned;

    public static ReservationDetailDTO from(ReservationItem ri) {
        ItemDetail detail = ri.getItemDetail();
        Item item = detail.getItem();

        return ReservationDetailDTO.builder()
                .reserveId(ri.getReservation().getReserveId())
                .rentItemId(ri.getRentItemId())
                .name(item.getName())
                .size(detail.getSize())
                .quantity(ri.getQuantity())
                .rentStart(ri.getRentStart())
                .rentEnd(ri.getRentEnd())
                .price(detail.getPrice())
                .isReturned(ri.isReturned())
                .build();
    }
}