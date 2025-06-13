package com.example.skip.controller;

import com.example.skip.dto.reservation.ReservationGroupDTO;
import com.example.skip.entity.ReservationItem;
import com.example.skip.repository.RefundsHistoryRepository;
import com.example.skip.service.RefundsHistoryService;
import com.example.skip.service.ReservationItemService;
import com.example.skip.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationItemService reservationItemService;


    //예약 리스트
    @GetMapping
    public ResponseEntity<List<ReservationGroupDTO>>getReservationsByAdmin(@RequestParam("adminId") Long userId,
                                                                           @RequestParam(required = false) String username,
                                                                           @RequestParam(required = false) String returnDate){
        List<ReservationGroupDTO> reservations = reservationService.getGroupedReservationsByUserId(userId);
        return ResponseEntity.ok(reservations);
    }

    // 장비 반납
    @PatchMapping("/{rentItemId}/return")
    public ResponseEntity<?> returnReservItem(@PathVariable("rentItemId") Long rentItemId){
        reservationItemService.returnReservItem(rentItemId);
        return ResponseEntity.ok().build();
    }


}