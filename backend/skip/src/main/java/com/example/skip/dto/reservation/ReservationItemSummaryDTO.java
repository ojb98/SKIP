package com.example.skip.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationItemSummaryDTO {
    private Long rentItemId;
    private Long itemDetailId;
    private String itemName;  // itemDetail.getItem().getName()
    private String size;
    private int quantity;
    private Long subtotalPrice;
    private boolean isReturned;
}
