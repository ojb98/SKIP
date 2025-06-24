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

        // BooleanBuilder : 여러 조건(불린식)을 모으는 그릇
        // -> 여러 개의 BooleanExpression (조건)을 AND, OR 등으로 동적으로 조합할 때 사용
        BooleanBuilder builder = new BooleanBuilder();

        // 관리자(userId)가 소유한 렌탈샵의 예약만 조회
        builder.and(reservation.rent.user.userId.eq(userId));

        if (rentId != null) {
            builder.and(reservation.rent.rentId.eq(rentId));
        }

        if (status != null) {
            builder.and(reservation.status.eq(status));
        } else {
            builder.and(reservation.status.ne(ReservationStatus.READY));
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
            // containsIgnoreCase() : 문자열이 특정 값을 포함하는지(부분 일치)를 대소문자 구분 없이 검사할 때 사용
            keywordFilter.or(reservation.user.username.containsIgnoreCase(keyword));
            keywordFilter.or(reservation.user.name.containsIgnoreCase(keyword));
            builder.and(keywordFilter);
        }

        // .fetchJoin() : 즉시 로딩(Eager) 하도록 강제로 조인해서 한 번에 가져오기
        // 예약(reservation) 을 중심으로 모두 한 번에 조회
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

        return query.fetch();  //List<Reservation> 형태로 불러온다(여러 개 결과 조회)
        /**
         *  fetchOne() → 결과가 하나일 때 (단건 조회)
         *  fetchFirst() → 결과 중 첫 번째 한 건만 조회
         *  fetchCount() → 총 개수만 조회 (select count(*))
         */
    }
}
