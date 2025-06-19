package com.example.skip.view;

import com.blazebit.persistence.view.EntityView;
import com.blazebit.persistence.view.IdMapping;
import com.blazebit.persistence.view.Mapping;
import com.example.skip.entity.RefundsHistory;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.RefundStatus;

import java.time.LocalDateTime;

@EntityView(RefundsHistory.class)
public interface RefundsHistoryDetailsView {
    @IdMapping
    Long getRefundId();

    @Mapping("payment.paymentId")
    Long getPaymentId();

    @Mapping("reservationItem.rentItemId")
    Long getRentItemId();

    @Mapping("reservationItem.reservation.reserveId")
    Long getReserveId();

    @Mapping("reservationItem.quantity")
    int getQuantity();

    @Mapping("reservationItem.subtotalPrice")
    Long getSubtotalPrice();

    @Mapping("reservationItem.itemDetail.size")
    String getSize();

    @Mapping("reservationItem.itemDetail.item.category")
    ItemCategory getCategory();

    @Mapping("reservationItem.itemDetail.item.name")
    String getName();

    Double getRefundPrice();

    String getReason();

    RefundStatus getStatus();

    LocalDateTime getRefundedAt();

    LocalDateTime getCreatedAt();
}
