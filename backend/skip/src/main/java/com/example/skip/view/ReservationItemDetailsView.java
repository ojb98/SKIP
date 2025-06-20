package com.example.skip.view;

import com.blazebit.persistence.view.EntityView;
import com.blazebit.persistence.view.IdMapping;
import com.blazebit.persistence.view.Mapping;
import com.example.skip.entity.ReservationItem;
import com.example.skip.enumeration.ItemCategory;

import java.time.LocalDateTime;
import java.util.List;

@EntityView(ReservationItem.class)
public interface ReservationItemDetailsView {
    @IdMapping
    Long getRentItemId();

    @Mapping("reservation.reserveId")
    Long getReserveId();

    @Mapping("itemDetail.itemDetailId")
    Long getItemDetailId();

    @Mapping("itemDetail.size")
    String getItemDetailSize();

    @Mapping("itemDetail.item.category")
    ItemCategory getItemCategory();

    @Mapping("itemDetail.item.name")
    String getItemName();

    @Mapping("itemDetail.item.image")
    String getItemImage();

    @Mapping("refundsHistories")
    List<RefundsHistoryView> getRefundsHistories();

    LocalDateTime getRentStart();

    LocalDateTime getRentEnd();

    Long getSubtotalPrice();

    int getQuantity();

    boolean getIsReturned();

    boolean getReviewed();
}
