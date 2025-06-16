package com.example.skip.service;

import com.blazebit.persistence.CriteriaBuilder;
import com.blazebit.persistence.CriteriaBuilderFactory;
import com.blazebit.persistence.view.EntityViewManager;
import com.blazebit.persistence.view.EntityViewSetting;
import com.example.skip.dto.CommissionRateDTO;
import com.example.skip.dto.refund.RefundDetailDTO;
import com.example.skip.dto.refund.RefundSummaryDTO;
import com.example.skip.dto.request.RefundSearchRequest;
import com.example.skip.entity.*;
import com.example.skip.enumeration.RefundStatus;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.refund.RefundsHistoryRepository;
import com.example.skip.repository.ReservationItemRepository;
import com.example.skip.util.IamportTokenUtil;
import com.example.skip.view.RefundsHistoryDetailsView;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(isolation = Isolation.READ_COMMITTED)
@RequiredArgsConstructor
@Slf4j
public class RefundsHistoryService {

    private final IamportTokenUtil iamportTokenUtil;
    private final ItemDetailRepository itemDetailRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final RefundsHistoryRepository refundsHistoryRepository;

    private final JPAQueryFactory jpaQueryFactory;

    private final CriteriaBuilderFactory criteriaBuilderFactory;

    private final EntityManager entityManager;

    private final EntityViewManager entityViewManager;

    private static final QRefundsHistory refundsHistory = QRefundsHistory.refundsHistory;

    private static final QReservationItem reservationItem = QReservationItem.reservationItem;

    private static final QReservation reservation = QReservation.reservation;

    private static final QUser user = QUser.user;


    // 환불 내역 항목
    public List<RefundSummaryDTO> findRefunds(Long userId, Long rentId, RefundStatus status,
                                              LocalDateTime startDate,LocalDateTime endDate, String sort) {

        List<RefundsHistory> entities =
                refundsHistoryRepository.findWithFilters(userId, rentId ,status, startDate, endDate , sort);

        // Entity → DTO 변환
        return entities.stream()
                .map(e -> new RefundSummaryDTO(
                        e.getRefundId(),
                        e.getReservationItem().getReservation().getReserveId(),
                        e.getReservationItem().getReservation().getMerchantUid(),
                        e.getReservationItem().getReservation().getRent().getRentId(),
                        e.getReservationItem().getReservation().getRent().getName(),
                        e.getReservationItem().getItemDetail().getItem().getName(),
                        e.getReservationItem().getQuantity(),
                        e.getRefundPrice(),
                        e.getStatus(),
                        e.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // 환불 상세
    public RefundDetailDTO findRefundDetail(Long refundId) {
        RefundsHistory refund = refundsHistoryRepository.findById(refundId)
                .orElseThrow(() -> new EntityNotFoundException("환불내역 없음"));

        Reservation reservation = refund.getReservationItem().getReservation();
        User user = reservation.getUser();
        ItemDetail item = refund.getReservationItem().getItemDetail();

        return new RefundDetailDTO(
                refund.getRefundId(),
                refund.getRefundPrice(),
                refund.getAdminRefundPrice(),
                refund.getRentRefundPrice(),
                refund.getReason(),
                refund.getStatus(),
                refund.getRefundedAt(),
                refund.getCreatedAt(),

                refund.getPayment().getPaymentId(),
                refund.getPayment().getTotalPrice(),

                reservation.getReserveId(),
                user.getName(),
                user.getEmail(),

                refund.getReservationItem().getRentItemId(),
                item.getItem().getName(),
                refund.getReservationItem().getQuantity(),
                refund.getReservationItem().getRentStart(),
                refund.getReservationItem().getRentEnd()
        );
    }



    //사용자 환불요청 메서드
    public RefundsHistory requestRefund(Long rentItemId, String reason) {
        // rentItemId로 ReservationItem 조회
        ReservationItem item = reservationItemRepository.findById(rentItemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

        // Reservation 꺼내오기
        Reservation reservation = item.getReservation();

        double refundAmount = item.getSubtotalPrice();

        CommissionRateDTO commission = new CommissionRateDTO(reservation.getReserveId(), reservation.getPayment().getTotalPrice());
        double ratio = refundAmount / commission.getTotalPrice();

        RefundsHistory refund = RefundsHistory.builder()
                .payment(reservation.getPayment())
                .reservationItem(item)
                .refundPrice(refundAmount)
                .adminRefundPrice(commission.getAdminFee() * ratio)
                .rentRefundPrice(commission.getRentFee() * ratio)
                .reason(reason)
                .status(RefundStatus.REQUESTED)
                .createdAt(LocalDateTime.now())
                .build();

        return refundsHistoryRepository.save(refund);
    }

    // 관리자 승인 처리 메서드 (락이 걸린 상태에서 재고 처리해주기 - 아직 안함)
    public RefundsHistory approveRefund(Long refundId) throws IOException {
        RefundsHistory refund = refundsHistoryRepository.findById(refundId)
                .orElseThrow(() -> new IllegalArgumentException("환불 요청 없음"));

        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new IllegalStateException("이미 환불 처리된 건입니다.");
        }

        // 포트원 환불 요청
        String token = iamportTokenUtil.getIamportToken();
        String requestBody = new ObjectMapper().writeValueAsString(Map.of(
                "imp_uid", refund.getReservationItem().getReservation().getImpUid(),
                "amount", refund.getRefundPrice(),
                "reason", refund.getReason()
        ));

        Request request = new Request.Builder()
                .url("https://api.iamport.kr/payments/cancel")
                .post(RequestBody.create(requestBody, MediaType.get("application/json")))
                .addHeader("Authorization", token)
                .build();

        try (Response response = new OkHttpClient().newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IllegalStateException("포트원 환불 실패: " + response);
            }
        }

        // 상태 업데이트
        refund.setStatus(RefundStatus.COMPLETED);
        refund.setRefundedAt(LocalDateTime.now());

        // 예약상세 상태 반영: 재고 복원 (락을 걸고 재고 복원)
        ReservationItem item = refund.getReservationItem();

        ItemDetail itemDetail =
                    itemDetailRepository.findByIdWithLock(
                            item.getItemDetail().getItemDetailId())
                            .orElseThrow(() -> new IllegalArgumentException("아이템 상세 정보 없음"));

            // 락이 걸린 상태에서 재고 복원
            itemDetail.setStockQuantity(
                    itemDetail.getStockQuantity() + item.getQuantity()
            );

        Reservation reservation = item.getReservation();
        // 모든 아이템이 환불되었거나 반납되었는지 체크
        boolean allRefundedOrReturned = reservation.getReservationItems()
                .stream()
                .allMatch(i -> i.isReturned() ||
                        refundsHistoryRepository.existsByReservationItemAndStatus(i, RefundStatus.COMPLETED));

        if (allRefundedOrReturned) {
            reservation.setStatus(ReservationStatus.CANCELLED);
        } else {
            reservation.setStatus(ReservationStatus.PARTIALLY_CANCELLED);
        }

        return refund;
    }

    // 마이페이지 환불 내역
    public Page<RefundsHistoryDetailsView> listRefunds(RefundSearchRequest refundSearchRequest,
                                                       Long userId,
                                                       Pageable pageable) {

        List<Long> pagedIds = jpaQueryFactory
                .selectDistinct(refundsHistory.refundId)
                .from(refundsHistory)
                .leftJoin(refundsHistory.reservationItem, reservationItem)
                .leftJoin(reservationItem.reservation, reservation)
                .leftJoin(reservation.user, user)
                .where(user.userId.eq(userId))
                .where(refundSearchRequest.toPredicate(refundsHistory))
                .orderBy(refundSearchRequest.getSort().getSpecifier())
                .fetch();

        CriteriaBuilder<RefundsHistory> criteriaBuilder = criteriaBuilderFactory.create(entityManager, RefundsHistory.class);
        criteriaBuilder
                .where("refundId").in(pagedIds);
        refundSearchRequest.getSort().applyTo(criteriaBuilder);
        criteriaBuilder
                .orderByDesc("refundId");

        List<RefundsHistoryDetailsView> result = entityViewManager.applySetting(
                EntityViewSetting.create(RefundsHistoryDetailsView.class),
                criteriaBuilder
        ).getResultList();

        Long count = Optional.ofNullable(
                jpaQueryFactory
                        .select(refundsHistory.countDistinct())
                        .from(refundsHistory)
                        .leftJoin(refundsHistory.reservationItem, reservationItem)
                        .leftJoin(reservationItem.reservation, reservation)
                        .leftJoin(reservation.user, user)
                        .where(user.isNotNull().and(user.userId.eq(userId)))
                        .where(refundSearchRequest.toPredicate(refundsHistory))
                        .fetchOne()
        ).orElse(0L);

        log.info("count: {}", count);

        return new PageImpl<>(result, pageable, count);
    }


}
