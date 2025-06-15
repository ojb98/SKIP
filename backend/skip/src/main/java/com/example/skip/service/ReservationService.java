package com.example.skip.service;

import com.blazebit.persistence.CriteriaBuilder;
import com.blazebit.persistence.CriteriaBuilderFactory;
import com.blazebit.persistence.PagedList;
import com.blazebit.persistence.view.EntityViewManager;
import com.blazebit.persistence.view.EntityViewSetting;
import com.example.skip.dto.request.ReservationSearchRequest;
import com.example.skip.dto.reservation.ReservationDetailDTO;
import com.example.skip.dto.reservation.ReservationGroupDTO;
import com.example.skip.dto.reservation.ReservationItemDTO;
import com.example.skip.dto.reservation.ReservationWithItemsDto;
import com.example.skip.entity.*;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.ReservationRepository;
import com.example.skip.views.ReservationDetailsWithItemsView;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.Projections;
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
import java.util.*;
import java.util.stream.Collectors;


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

    private static final QItemDetail itemDetail = QItemDetail.itemDetail;

    private static final QItem item = QItem.item;


    public List<ReservationGroupDTO> getGroupedReservationsByUserId(Long userId) {

        List<Reservation> reservations = reservationRepository.findReservationsByUserId(userId);

        // merchantUid 별로 그룹핑하기
        Map<String, ReservationGroupDTO> groupedMap = new LinkedHashMap<>();

        for (Reservation r : reservations) {
            String merchantUid = r.getMerchantUid();

            ReservationGroupDTO group = groupedMap.get(merchantUid);
            if (group == null) {
                group = ReservationGroupDTO.builder()
                        .merchantUid(merchantUid)
                        .rentId(r.getRent().getRentId())
                        .rentName(r.getRent().getName())
                        .username(r.getUser().getUsername())
                        .status(ReservationStatus.valueOf(r.getStatus().name()))
                        .totalPrice(0)
                        .createdAt(r.getCreatedAt())
                        .reserveIds(new ArrayList<>())
                        .items(new ArrayList<>())
                        .build();
                groupedMap.put(merchantUid, group);
            }

            group.getReserveIds().add(r.getReserveId());

            // 각 Reservation의 ReservationItem 들을 ReservationDetailDTO로 변환
            for (ReservationItem ri : r.getReservationItems()) {
                group.getItems().add(ReservationDetailDTO.from(ri));
                group.setTotalPrice(group.getTotalPrice() + ri.getSubtotalPrice().intValue());
            }
        }

        return new ArrayList<>(groupedMap.values());
    }

    // 마이페이지 예약 목록 불러오기
//    public Page<ReservationWithItemsDto> listReservationsWithItems(ReservationSearchRequest reservationSearchRequest, Long userId, Pageable pageable) {
//        List<Long> pagedIds = jpaQueryFactory
//                .select(reservation.reserveId)
//                .distinct()
//                .from(reservation)
//                .leftJoin(reservation.reservationItems, reservationItem)
//                .where(reservation.user.userId.eq(userId).and(reservationSearchRequest.toPredicate(reservation, reservationItem)))
//                .offset(pageable.getOffset())
//                .limit(pageable.getPageSize())
//                .orderBy(reservation.createdAt.desc())
//                .fetch();
//
//        log.info("pagedIds: {}", pagedIds);
//
//        if (pagedIds.isEmpty()) {
//            return new PageImpl<>(List.of(), pageable, 0L);
//        }
//
//        List<Reservation> list = jpaQueryFactory
//                .selectFrom(reservation)
//                .leftJoin(reservation.user, user).fetchJoin()
//                .leftJoin(reservation.payment, payment).fetchJoin()
//                .leftJoin(reservation.reservationItems, reservationItem).fetchJoin()
//                .where(reservation.reserveId.in(pagedIds))
//                .orderBy(reservation.createdAt.desc())
//                .fetch();
//
//        log.info("list: {}", list);
//
//
//
//        List<ReservationWithItemsDto> result = list.stream().map(r -> ReservationWithItemsDto.builder()
//                    .reserveId(r.getReserveId())
//                    .userId(r.getUser().getUserId())
//                    .rentId(r.getRent().getRentId())
//                    .paymentId(r.getPayment().getPaymentId())
//                    .totalPrice(r.getTotalPrice())
//                    .createdAt(r.getCreatedAt())
//                    .merchantUid(r.getMerchantUid())
//                    .impUid(r.getImpUid())
//                    .status(r.getStatus())
//                    .reservationItems(r.getReservationItems().stream().map(ReservationItemDTO::new).toList())
//                    .build())
//                .toList();
//
//        Long count = Optional.ofNullable(
//                jpaQueryFactory
//                        .select(reservation.countDistinct())
//                        .from(reservation)
//                        .leftJoin(reservation.reservationItems, reservationItem)
//                        .where(reservation.user.userId.eq(userId).and(reservationSearchRequest.toPredicate(reservation, reservationItem)))
//                        .fetchOne()
//        ).orElse(0L);
//
//        log.info("count: {}", count);
//
//        return new PageImpl<>(result, pageable, count);
//    }
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

