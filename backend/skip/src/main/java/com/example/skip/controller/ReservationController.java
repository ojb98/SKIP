package com.example.skip.controller;

import com.example.skip.dto.reservation.ReservationDetailDTO;
import com.example.skip.dto.reservation.ReservationSummaryDTO;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.service.ReservationItemService;
import com.example.skip.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationItemService reservationItemService;


    //예약 리스트
//    @GetMapping
//    public ResponseEntity<List<ReservationGroupDTO>>getReservationsByAdmin(@RequestParam("adminId") Long userId,
//                                                                           @RequestParam(required = false) String username,
//                                                                           @RequestParam(required = false) String returnDate){
//        List<ReservationGroupDTO> reservations = reservationService.getGroupedReservationsByUserId(userId);
//        return ResponseEntity.ok(reservations);
//    }


    @GetMapping("/manager/{userId}")
    public List<ReservationSummaryDTO> getReservations(
            @PathVariable Long userId,
            @RequestParam(required = false) Long rentId,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime rentStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime rentEnd,
            @RequestParam(required = false) String keyword
    ) {
        return reservationService.getReservationSummaries(userId, rentId, status, rentStart, rentEnd, keyword);
    }

    @GetMapping("/detail/{rentItemId}")
    public ReservationDetailDTO getReservationDetail(@PathVariable Long rentItemId) {
        return reservationItemService.getReservationDetail(rentItemId);
    }

    // 장비 반납
    @PatchMapping("/{rentItemId}/return")
    public ResponseEntity<?> returnReservItem(@PathVariable("rentItemId") Long rentItemId){
        reservationItemService.returnReservItem(rentItemId);
        return ResponseEntity.ok().build();
    }


}