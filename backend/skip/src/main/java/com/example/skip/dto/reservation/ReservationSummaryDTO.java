package com.example.skip.dto.reservation;

import com.example.skip.enumeration.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationSummaryDTO {
    private Long reserveId;
    private String merchantUid;

    //회원
    private Long userId;
    private String username;

    //렌탈샵
    private Long rentId;
    private String rentName;

    //예약
    private Long totalPrice;
    private LocalDateTime createdAt;
    private ReservationStatus status;

    // 예약된 장비들
    private List<ReservationItemSummaryDTO> items;
}
