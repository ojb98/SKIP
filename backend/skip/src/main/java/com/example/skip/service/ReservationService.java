package com.example.skip.service;

import com.example.skip.dto.reservation.ReservationDetailDTO;
import com.example.skip.dto.reservation.ReservationItemSummaryDTO;
import com.example.skip.dto.reservation.ReservationSummaryDTO;
import com.example.skip.entity.*;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.RentRepository;
import com.example.skip.repository.reservation.ReservationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    /**
     * 예약 목록 조회 - 필터 조건 적용
     */
    public List<Reservation> getReservationsWithFilters(Long userId,
                                                        Long rentId,
                                                        ReservationStatus status,
                                                        LocalDateTime startDate,
                                                        LocalDateTime endDate,
                                                        String keyword,
                                                        String sort) {
        return reservationRepository.findWithFilters(userId, rentId, status, startDate, endDate, keyword, sort);
    }

    /**
     * 예약 목록 DTO로 변환해서 반환 (필요시)
     */
    public List<ReservationSummaryDTO> getReservationSummaries(Long userId,
                                                               Long rentId,
                                                               ReservationStatus status,
                                                               LocalDateTime startDate,
                                                               LocalDateTime endDate,
                                                               String keyword,
                                                               String sort) {
        List<Reservation> reservations = getReservationsWithFilters(userId, rentId, status, startDate, endDate, keyword, sort);

        return reservations.stream().map(reservation ->
                ReservationSummaryDTO.builder()
                        .reserveId(reservation.getReserveId())
                        .merchantUid(reservation.getImpUid())
                        .userId(reservation.getUser().getUserId())
                        .username(reservation.getUser().getUsername())
                        .rentId(reservation.getRent().getRentId())
                        .rentName(reservation.getRent().getName())
                        .totalPrice(reservation.getTotalPrice())
                        .createdAt(reservation.getCreatedAt())
                        .status(reservation.getStatus())
                        .items(
                                reservation.getReservationItems().stream()
                                        .map(item -> ReservationItemSummaryDTO.builder()
                                                .rentItemId(item.getRentItemId())
                                                .itemDetailId(item.getItemDetail().getItemDetailId())
                                                .itemName(item.getItemDetail().getItem().getName())
                                                .size(item.getItemDetail().getSize())
                                                .quantity(item.getQuantity())
                                                .subtotalPrice(item.getSubtotalPrice())
                                                .isReturned(item.isReturned())
                                                .build()
                                        ).collect(Collectors.toList())
                        )
                        .build()
        ).collect(Collectors.toList());
    }

}

