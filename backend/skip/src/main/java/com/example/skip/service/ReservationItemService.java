package com.example.skip.service;

import com.example.skip.dto.reservation.ReservationDetailDTO;
import com.example.skip.entity.Rent;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.repository.ReservationItemRepository;
import com.example.skip.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationItemService {

//    private final ReservationItemRepository reservationItemRepository;
//    private final ReservationRepository reservationRepository;
//
//    public List<ReservationDetailDTO> getReservationDetails(Long reserveId){
//        Reservation reservation = reservationRepository.findById(reserveId)
//                .orElseThrow(()-> new IllegalArgumentException("예약 없음"));
//
//        // 여러 예약 아이템이 있을 수 있으므로 리스트로 받기
//        List<ReservationItem> reservationItems =
//                reservationItemRepository.findAllByReservation(reservation);
//
//        return reservationItems.stream()
//                .map(item -> new ReservationDetailDTO(
//                        item.getItemDetail().getItem().getItemId(),
//                        item.getItemDetail().getItemDetailId(),
//                        item.getItemDetail().getItem().getName(),
//                        item.getItemDetail().getSize(),
//                        item.getQuantity(),
//                        item.getRentStart(),
//                        item.getRentEnd(),
//                        item.getItemDetail().getTotalQuantity(),
//                        item.getItemDetail().getStockQuantity()
//                ))
//                .collect(Collectors.toList());
//    }

}
