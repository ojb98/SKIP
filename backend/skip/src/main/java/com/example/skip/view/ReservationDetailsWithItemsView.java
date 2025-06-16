package com.example.skip.view;

import com.blazebit.persistence.view.EntityView;
import com.blazebit.persistence.view.FetchStrategy;
import com.blazebit.persistence.view.IdMapping;
import com.blazebit.persistence.view.Mapping;
import com.example.skip.entity.Reservation;
import com.example.skip.enumeration.ReservationStatus;

import java.time.LocalDateTime;
import java.util.List;

@EntityView(Reservation.class)
public interface ReservationDetailsWithItemsView {
    @IdMapping
    Long getReserveId();

    @Mapping("user.userId")
    Long getUserId();

    @Mapping("rent.rentId")
    Long getRentId();

    @Mapping("rent.name")
    String getRentName();

    @Mapping("rent.thumbnail")
    String getRentThumbnail();

    @Mapping("payment.paymentId")
    Long getPaymentId();

    Long getTotalPrice();

    ReservationStatus getStatus();

    LocalDateTime getCreatedAt();

    String getMerchantUid();

    String getImpUid();

    @Mapping(value = "reservationItems", fetch = FetchStrategy.SUBSELECT)
    List<ReservationItemDetailsView> getReservationItems();
}
