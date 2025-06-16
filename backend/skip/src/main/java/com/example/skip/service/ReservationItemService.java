package com.example.skip.service;

import com.example.skip.dto.reservation.ReservationDetailDTO;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.entity.User;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.reservation.ReservationItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(isolation = Isolation.READ_COMMITTED)
@RequiredArgsConstructor
public class ReservationItemService {


    private final ReservationItemRepository reservationItemRepository;
    private final ItemDetailRepository itemDetailRepository;

    public ReservationDetailDTO getReservationDetail(Long rentItemId) {
        ReservationItem item = reservationItemRepository.findById(rentItemId)
                .orElseThrow(() -> new EntityNotFoundException("예약 상세 정보가 존재하지 않습니다."));

        Reservation reservation = item.getReservation();
        ItemDetail detail = item.getItemDetail();
        User user = reservation.getUser();

        return ReservationDetailDTO.builder()
                .rentItemId(item.getRentItemId())
                .reserveId(reservation.getReserveId())
                .quantity(item.getQuantity())
                .subtotalPrice(item.getSubtotalPrice())
                .rentStart(item.getRentStart())
                .rentEnd(item.getRentEnd())
                .isReturned(item.isReturned())

                .name(user.getName())
                .userEmail(user.getEmail())

                .itemDetailId(detail.getItemDetailId())
                .itemName(detail.getItem().getName())
                .size(detail.getSize())
                .totalQuantity(detail.getTotalQuantity())
                .stockQuantity(detail.getStockQuantity())
                .rentHour(detail.getRentHour())
                .build();
    }

    // 예약 반납완료 변경 및 재고수량 변경
    public void returnReservItem(Long rentItemId) {

        // 1. 예약 아이템 조회 (락)
        ReservationItem item = reservationItemRepository.findByIdWithLock(rentItemId)
                .orElseThrow(() -> new IllegalArgumentException("예약 아이템을 찾을 수 없습니다."));

        // 이미 반납된 아이템이면 예외 처리
        if (item.isReturned()) {
            throw new IllegalStateException("이미 반납된 장비입니다.");
        }

        // 2. 재고 증가
        ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(item.getItemDetail().getItemDetailId())
                .orElseThrow(() -> new IllegalArgumentException("아이템 상세 정보를 찾을 수 없습니다."));
        itemDetail.setStockQuantity(itemDetail.getStockQuantity() + item.getQuantity());

        // 3. 해당 아이템 반납 표시
        item.setReturned(true); // isReturned = true 로 변경

        // 4. 예약 상태 업데이트
        Reservation reservation = item.getReservation();

        boolean allReturned = reservation.getReservationItems().stream()
                .allMatch(ReservationItem::isReturned);

        boolean anyReturned = reservation.getReservationItems().stream()
                .anyMatch(ReservationItem::isReturned);

        if (allReturned) {
            reservation.setStatus(ReservationStatus.RETURNED);
        } else if (anyReturned) {
            reservation.setStatus(ReservationStatus.PARTIALLY_RETURNED);
        }

    }
}
