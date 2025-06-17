package com.example.skip.dto.reservation;

import com.example.skip.entity.QItemDetail;
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

    //예약상세정보
    private Long rentItemId;
    private Long reserveId;
    private int quantity;
    private Long subtotalPrice;
    private LocalDateTime rentStart;
    private LocalDateTime rentEnd;
    private boolean isReturned;

    //회원정보
    private String name;
    private String userEmail;

    //장비 상세정보
    private Long itemDetailId;
    private String itemName;
    private String size;
    private Integer totalQuantity;
    private Integer stockQuantity;
    private Integer rentHour;

}


