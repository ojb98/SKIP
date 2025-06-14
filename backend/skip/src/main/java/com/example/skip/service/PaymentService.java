package com.example.skip.service;

import com.example.skip.dto.payment.PaymentCompleteDTO;
import com.example.skip.entity.*;
import com.example.skip.enumeration.PaymentStatus;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.*;
import com.example.skip.repository.reservation.ReservationItemRepository;
import com.example.skip.repository.reservation.ReservationRepository;
import com.example.skip.util.IamportTokenUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Slf4j
@Transactional(isolation = Isolation.READ_COMMITTED)
@RequiredArgsConstructor
public class PaymentService {

    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final UserRepository userRepository;
    private final RentRepository rentRepository;
    private final ItemDetailRepository itemDetailRepository;
    private final CartItemRepository cartItemRepository;
    private final IamportTokenUtil iamportTokenUtil;
    private final PaymentRepository paymentRepository;
    // JSON ↔ 객체 변환을 위한 Jackson 클래스
    private final ObjectMapper objectMapper = new ObjectMapper();
    // HTTP 클라이언트 객체 생성
    private final OkHttpClient client = new OkHttpClient();;

    // 결제 검증(예약+예약상세+결제) 생성
    public boolean completePaymentWithReservation(PaymentCompleteDTO dto) throws IOException {

        // 1. 토큰 발급
        String accessToken = iamportTokenUtil.getIamportToken();

        // 2. 결제 검증
        // 아임포트에 결제 상세 정보 요청 (impUid 기반)
        Request paymentRequest = new Request.Builder()
                .url("https://api.iamport.kr/payments/" + dto.getImpUid())
                .get()
                .addHeader("Authorization", accessToken)
                .build();

        // 응답(결제정보를 조회)에서 실제 결제 금액과 merchantUid 추출
        long paidAmount;
        String merchantUid;
        try (Response paymentResponse = client.newCall(paymentRequest).execute()) {
            if (!paymentResponse.isSuccessful()) throw new IOException("결제 정보 조회 실패: " + paymentResponse);

            JsonNode paymentInfo = objectMapper.readTree(paymentResponse.body().string()).get("response");
            paidAmount = paymentInfo.get("amount").asLong();
            merchantUid = paymentInfo.get("merchant_uid").asText();
        }

        // 3. 금액 검증 (프론트에서 보낸 금액과 아임포트에서 조회한 금액이 일치하는지 검증)
        if (!dto.getAmount().equals(paidAmount)) {
            throw new IllegalStateException("결제 금액이 일치하지 않습니다.");
        }

        // 4. 예약 생성
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        // 모든 예약 항목의 소계 금액을 합산하여 totalPrice 계산
        Long totalPrice = dto.getReservationItems().stream()
                .mapToLong(PaymentCompleteDTO.ReservationItemDTO::getSubtotalPrice)
                .sum();

        // 5. Payment 생성
        Payment payment = Payment.builder()
                .merchantUid(merchantUid)
                .impUid(dto.getImpUid())
                .totalPrice((double) totalPrice)
                .commissionRate(0.1)
                .adminPrice(totalPrice * 0.1)
                .rentPrice(totalPrice * 0.9)
                .method("card")
                .pgProvider("kakaopay.TC0ONETIME")
                .status(PaymentStatus.PAID)
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // 6. Reservation 여러 건 생성 및 Payment에 연결
        for (PaymentCompleteDTO.ReservationItemDTO itemDto : dto.getReservationItems()) {
            CartItem cartItem = cartItemRepository.findById(itemDto.getCartId())
                    .orElseThrow(() -> {
                        log.error("카트 아이템 없음! cartId={}", itemDto.getCartId());
                        return new IllegalArgumentException("카트 아이템 없음: " + itemDto.getCartId());
                    });
            Rent rent = rentRepository.findById(itemDto.getRentId())
                    .orElseThrow(() -> new IllegalArgumentException("렌트 정보 없음"));

            Reservation reservation = Reservation.builder()
                    .user(user)
                    .rent(rent)
                    .totalPrice(itemDto.getSubtotalPrice())
                    .merchantUid(merchantUid)
                    .impUid(dto.getImpUid())
                    .payment(payment)
                    .status(ReservationStatus.RESERVED)
                    .build();

            reservationRepository.save(reservation);
            // 결제 정보에 예약 추가 (양방향 연관 관계)
            payment.getReservations().add(reservation);

            // 7. 예약 아이템도 생성
            ReservationItem reservationItem = ReservationItem.builder()
                    .reservation(reservation)
                    .itemDetail(cartItem.getItemDetail())
                    .rentStart(cartItem.getRentStart())
                    .rentEnd(cartItem.getRentEnd())
                    .quantity(cartItem.getQuantity())
                    .subtotalPrice(itemDto.getSubtotalPrice())
                    .build();
            reservationItemRepository.save(reservationItem);

            // 8. 재고 정보 락(lock) 걸고 조회 → 동시성 문제 방지
            ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(cartItem.getItemDetail().getItemDetailId())
                    .orElseThrow(() -> new IllegalArgumentException("아이템 상세 정보 없음"));

            // 9. 재고 차감
            int currentStock = itemDetail.getStockQuantity();
            int reservedQty = cartItem.getQuantity();

            if (currentStock < reservedQty) {
                throw new IllegalStateException("재고가 부족합니다. 남은 수량: " + currentStock);
            }
            itemDetail.setStockQuantity(currentStock - reservedQty);

            // 10. 장바구니 삭제
            cartItemRepository.delete(cartItem);
        }

        return true;
    }

}