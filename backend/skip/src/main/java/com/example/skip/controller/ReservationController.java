package com.example.skip.controller;


import com.example.skip.dto.reservation.ReservationDetailDTO;
import com.example.skip.dto.reservation.ReservationGroupDTO;
import com.example.skip.service.ReservationItemService;
import com.example.skip.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationItemService reservationItemService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<ReservationGroupDTO>>getReservationsByAdmin(@PathVariable Long userId){
        List<ReservationGroupDTO> reservations = reservationService.getGroupedReservationsByUserId(userId);
        return ResponseEntity.ok(reservations);
    }



}
