package com.example.skip.service;

import com.blazebit.persistence.*;
import com.blazebit.persistence.view.EntityViewManager;
import com.blazebit.persistence.view.EntityViewSetting;
import com.example.skip.dto.request.ReservationSearchRequest;
import com.example.skip.dto.reservation.ReservationItemSummaryDTO;
import com.example.skip.dto.reservation.ReservationSummaryDTO;
import com.example.skip.entity.*;
import com.example.skip.entity.*;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.reservation.ReservationRepository;
import com.example.skip.view.ReservationDetailsWithItemsView;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import java.util.*;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    private final JPAQueryFactory jpaQueryFactory;

    private final EntityManager entityManager;

    private final EntityViewManager entityViewManager;

    private final CriteriaBuilderFactory criteriaBuilderFactory;

    private static final QReservation reservation = QReservation.reservation;

    private static final QRent rent = QRent.rent;

    private static final QUser user = QUser.user;

    private static final QPayment payment = QPayment.payment;

    private static final QReservationItem reservationItem = QReservationItem.reservationItem;

    private static final QRefundsHistory refundsHistory = QRefundsHistory.refundsHistory;

    private static final QItemDetail itemDetail = QItemDetail.itemDetail;

    private static final QItem item = QItem.item;

    /**
     * 예약 목록 조회 - 필터 조건 적용
     */
    public List<Reservation> getReservationsWithFilters(Long userId,
                                                        Long rentId,
                                                        ReservationStatus status,
                                                        LocalDateTime rentStart,
                                                        LocalDateTime rentEnd,
                                                        String keyword) {
        return reservationRepository.findWithFilters(userId, rentId, status, rentStart, rentEnd, keyword);
    }

    /**
     * 예약 목록 DTO로 변환해서 반환 (필요시)
     */
    public List<ReservationSummaryDTO> getReservationSummaries(Long userId,
                                                               Long rentId,
                                                               ReservationStatus status,
                                                               LocalDateTime rentStart,
                                                               LocalDateTime rentEnd,
                                                               String keyword) {
        List<Reservation> reservations = getReservationsWithFilters(userId, rentId, status, rentStart, rentEnd, keyword);

        return reservations.stream().map(reservation ->
                ReservationSummaryDTO.builder()
                        .reserveId(reservation.getReserveId())
                        .merchantUid(reservation.getImpUid())
                        .userId(reservation.getUser().getUserId())
                        .username(reservation.getUser().getUsername())
                        .rentId(reservation.getRent().getRentId())
                        .rentName(reservation.getRent().getName())
                        .totalPrice(reservation.getTotalPrice())
                        .createdAt(reservation.getCreatedAt())
                        .status(reservation.getStatus())
                        .items(
                                reservation.getReservationItems().stream()
                                        .map(item -> ReservationItemSummaryDTO.builder()
                                                .rentItemId(item.getRentItemId())
                                                .itemDetailId(item.getItemDetail().getItemDetailId())
                                                .itemName(item.getItemDetail().getItem().getName())
                                                .size(item.getItemDetail().getSize())
                                                .quantity(item.getQuantity())
                                                .subtotalPrice(item.getSubtotalPrice())
                                                .isReturned(item.isReturned())
                                                .build()
                                        ).collect(Collectors.toList())
                        )
                        .build()
        ).collect(Collectors.toList());
    }

    // 마이페이지 예약 목록 불러오기
    public Page<ReservationDetailsWithItemsView> listReservationsWithItems(ReservationSearchRequest reservationSearchRequest,
                                                                           Long userId,
                                                                           Pageable pageable) {

        List<Long> pagedIds = jpaQueryFactory
                .select(reservation.reserveId)
                .distinct()
                .from(reservation)
                .leftJoin(reservation.rent, rent)
                .leftJoin(reservation.reservationItems, reservationItem)
                .leftJoin(reservationItem.itemDetail, itemDetail)
                .leftJoin(itemDetail.item, item)
                .leftJoin(reservationItem.refundsHistories, refundsHistory)
                .where(reservation.user.userId.eq(userId).and(reservationSearchRequest.toPredicate(reservation, reservationItem)))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(reservation.createdAt.desc())
                .fetch();

        CriteriaBuilder<Reservation> criteriaBuilder = criteriaBuilderFactory.create(entityManager, Reservation.class)
                .where("reserveId").in(pagedIds)
                .orderByDesc("createdAt")
                .orderByDesc("reserveId");

        List<ReservationDetailsWithItemsView> result = entityViewManager.applySetting(
                EntityViewSetting.create(ReservationDetailsWithItemsView.class),
                criteriaBuilder
        ).getResultList();

        Long count = Optional.ofNullable(
                jpaQueryFactory
                        .select(reservation.countDistinct())
                        .from(reservation)
                        .leftJoin(reservation.rent, rent)
                        .leftJoin(reservation.reservationItems, reservationItem)
                        .leftJoin(reservationItem.itemDetail, itemDetail)
                        .leftJoin(itemDetail.item, item)
                        .where(reservation.user.userId.eq(userId).and(reservationSearchRequest.toPredicate(reservation, reservationItem)))
                        .fetchOne()
        ).orElse(0L);

        return new PageImpl<>(result, pageable, count);
    }
}

