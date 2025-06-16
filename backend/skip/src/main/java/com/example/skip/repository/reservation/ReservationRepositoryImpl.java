package com.example.skip.repository.reservation;

import com.example.skip.entity.*;
import com.example.skip.enumeration.ReservationStatus;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
public class ReservationRepositoryImpl implements ReservationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Reservation> findWithFilters(Long userId,
                                             Long rentId,
                                             ReservationStatus status,
                                             LocalDateTime start,
                                             LocalDateTime end,
                                             String keyword
                                             ) {

        QReservation reservation = QReservation.reservation;
        QReservationItem item = QReservationItem.reservationItem;
        QRent rent = QRent.rent;
        QUser user = QUser.user;

        BooleanBuilder builder = new BooleanBuilder();

        // 관리자(userId)가 소유한 렌탈샵의 예약만 조회
        builder.and(reservation.rent.user.userId.eq(userId));

        if (rentId != null) {
            builder.and(reservation.rent.rentId.eq(rentId));
        }

        if (status != null) {
            builder.and(reservation.status.eq(status));
        }

        if (start != null) {
            builder.and(item.rentStart.goe(start));
        }

        if (end != null) {
            builder.and(item.rentEnd.loe(end));
        }

        // 🔍 keyword로 이름 또는 아이디 검색
        if (keyword != null && !keyword.isBlank()) {
            BooleanBuilder keywordFilter = new BooleanBuilder();
            keywordFilter.or(reservation.user.username.containsIgnoreCase(keyword));
            keywordFilter.or(reservation.user.name.containsIgnoreCase(keyword));
            builder.and(keywordFilter);
        }

        var query = queryFactory
                .selectFrom(reservation)
                .distinct()
                .leftJoin(reservation.user, user).fetchJoin()
                .leftJoin(reservation.rent, rent).fetchJoin()
                .leftJoin(reservation.reservationItems, item).fetchJoin()
                .leftJoin(item.itemDetail).fetchJoin()
                .leftJoin(item.itemDetail.item).fetchJoin()
                .where(builder)
                .orderBy(reservation.createdAt.desc());

        return query.fetch();
    }
}
