package com.example.skip.dto;

import com.example.skip.entity.Rent;
import com.example.skip.entity.Reservations;
import com.example.skip.entity.User;
import com.example.skip.enumeration.ReservationStatus;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ReservationsDTO {
    private Long reserveId;
    private Long userId;
    private Long rentId;
    private Long totalPrice;
    private ReservationStatus status;
    private LocalDateTime createdAt;

    public ReservationsDTO(Reservations reservations) {
        this.reserveId = reservations.getReserveId();
        this.userId = reservations.getUser().getUserId();
        this.rentId = reservations.getRent().getRentId();
        this.totalPrice = reservations.getTotalPrice();
        this.status = reservations.getStatus();
        this.createdAt = reservations.getCreatedAt();
    }

    public Reservations toEntity(User user, Rent rent) {
        Reservations reservations = Reservations.builder()
                .reserveId(reserveId)
                .user(user)
                .rent(rent)
                .totalPrice(totalPrice)
                .status(status)
                .createdAt(createdAt)
                .build();
        return reservations;
    }
}
