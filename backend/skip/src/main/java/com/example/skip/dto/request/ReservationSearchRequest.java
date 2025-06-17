package com.example.skip.dto.request;

import com.blazebit.persistence.CriteriaBuilder;
import com.example.skip.entity.QReservation;
import com.example.skip.entity.QReservationItem;
import com.example.skip.entity.Reservation;
import com.example.skip.enumeration.ReservationStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

@Data
@Slf4j
public class ReservationSearchRequest {
    private LocalDate from;

    private LocalDate to;

    private ReservationStatus status;

    private String searchOption;

    private String searchKeyword;


    public void applyTo(CriteriaBuilder<Reservation> criteriaBuilder) {
        if (from != null && to != null) {
            criteriaBuilder.where("createdAt").ge(from.atStartOfDay());
            criteriaBuilder.where("createdAt").lt(to.plusDays(1).atStartOfDay());
        }

        if (status != null) {
            criteriaBuilder.where("status").eq(status);
        }

        if (StringUtils.hasText(searchOption) && StringUtils.hasText(searchKeyword)) {
            criteriaBuilder.where(searchOption).like().value("%" + searchKeyword + "%");
        }
    }

    public BooleanExpression toPredicate(QReservation reservation, QReservationItem reservationItem) {
        return Expressions.allOf(
                datePredicate(reservation),
                hasStatus(reservation),
                hasKeyword(reservation, reservationItem)
        );
    }

    private BooleanExpression datePredicate(QReservation reservation) {
        log.info("from: {}", from);
        log.info("fromAtStartOfDay: {}", from.atStartOfDay());
        log.info("to: {}", to);
        log.info("toAtStartOfDay: {}", to.plusDays(1).atStartOfDay());
        if (from != null && to != null) {
            return reservation.createdAt.goe(from.atStartOfDay()).and(reservation.createdAt.lt(to.plusDays(1).atStartOfDay()));
        }
        return null;
    }

    private BooleanExpression hasStatus(QReservation reservation) {
        if (status != null) {
            return reservation.status.eq(status);
        }
        return null;
    }

    private BooleanExpression hasKeyword(QReservation reservation, QReservationItem reservationItem) {
        if (StringUtils.hasText(searchKeyword)) {
            if (searchOption.equals("RESERVE_ID")) {
                return reservation.reserveId.stringValue().contains(searchKeyword);
            } else if (searchOption.equals("NAME")) {
                return reservation.rent.name.containsIgnoreCase(searchKeyword);
            } else if (searchOption.equals("ITEM_NAME")) {
                return reservationItem.itemDetail.item.name.containsIgnoreCase(searchKeyword);
            }
        }
        return null;
    }
}
