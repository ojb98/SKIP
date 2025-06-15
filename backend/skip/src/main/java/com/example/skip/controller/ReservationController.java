package com.example.skip.controller;

import com.example.skip.dto.UserDto;
import com.example.skip.dto.request.ReservationSearchRequest;
import com.example.skip.dto.reservation.ReservationGroupDTO;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.service.ReservationItemService;
import com.example.skip.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
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

    // 마이페이지 예약 목록 불러오기
    @GetMapping("/search")
    public ApiResponse searchReservations(ReservationSearchRequest reservationSearchRequest,
                                          @AuthenticationPrincipal UserDto userDto,
                                          @PageableDefault(page = 0, size = 3) Pageable pageable) {

        log.info("page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        try {
            return ApiResponse.builder()
                    .success(true)
                    .data(reservationService.listReservationsWithItems(reservationSearchRequest, userDto.getUserId(), pageable))
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .data("예약 목록을 조회하지 못했습니다.")
                    .build();
        }
    }
}