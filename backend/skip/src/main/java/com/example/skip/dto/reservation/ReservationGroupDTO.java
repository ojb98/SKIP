package com.example.skip.dto.reservation;

import com.example.skip.enumeration.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReservationGroupDTO {
    private String merchantUid;
    private Long rentId;
    private String rentName;
    private String username;
    private String status;
    private int totalPrice;
    private LocalDateTime createdAt;
    private List<Long> reserveIds;
    private List<ReservationDetailDTO> items;

}