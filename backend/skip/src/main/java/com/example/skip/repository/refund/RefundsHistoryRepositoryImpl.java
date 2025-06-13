package com.example.skip.repository.refund;

import com.example.skip.entity.*;
import com.example.skip.enumeration.RefundStatus;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDateTime;
import java.util.List;

public class RefundsHistoryRepositoryImpl implements RefundsHistoryRespositoryCustom {

    @PersistenceContext
    private EntityManager em;

    private JPAQueryFactory queryFactory;

    // 생성자 또는 @PostConstruct에서 초기화
    public RefundsHistoryRepositoryImpl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public List<RefundsHistory> findWithFilters(
            Long userId,
            Long rentId, // 렌탈샵 구분
            RefundStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String sort
    ) {
        QRefundsHistory refund = QRefundsHistory.refundsHistory;
        QReservationItem reservationItem = QReservationItem.reservationItem;
        QReservation reservation = QReservation.reservation;
        QRent rent = QRent.rent;
        QUser user = QUser.user;

        BooleanBuilder builder = new BooleanBuilder();

        // 관리자 필수 필터
        builder.and(rent.user.userId.eq(userId));

        // 특정 렌탈샵 지정 시 필터
        if (rentId != null) {
            builder.and(rent.rentId.eq(rentId));
        }

        // 상태 필터
        if (status != null) {
            builder.and(refund.status.eq(status));
        }

        // 날짜 필터
        if (startDate != null) {
            builder.and(refund.createdAt.goe(startDate));
        }

        //"endDate 다음 날 0시 이전까지" 포함 (13일 설정하면 2025-06-14T00:00:00까지 포함)
        if (endDate != null) {
            builder.and(refund.createdAt.lt(endDate.plusDays(1))); // 하루 더해주기
        }

        var query = queryFactory
                .selectFrom(refund)
                .leftJoin(refund.reservationItem, reservationItem).fetchJoin()
                .leftJoin(reservationItem.itemDetail).fetchJoin()
                .leftJoin(refund.payment).fetchJoin()
                .leftJoin(reservationItem.reservation, reservation).fetchJoin()
                .leftJoin(reservation.rent, rent).fetchJoin()
                .leftJoin(rent.user, user).fetchJoin()
                .where(builder);

        // 정렬
        if ("ASC".equalsIgnoreCase(sort)) {
            query.orderBy(refund.createdAt.asc());
        } else {
            query.orderBy(refund.createdAt.desc());
        }

        return query.fetch();
    }
}
