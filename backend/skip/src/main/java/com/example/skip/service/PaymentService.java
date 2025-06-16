package com.example.skip.service;

import com.example.skip.dto.payment.PaymentCompleteDTO;
import com.example.skip.dto.payment.PaymentDirectDTO;
import com.example.skip.dto.request.PaymentFilterRequest;
import com.example.skip.entity.*;
import com.example.skip.enumeration.PaymentStatus;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.*;
import com.example.skip.repository.reservation.ReservationItemRepository;
import com.example.skip.repository.reservation.ReservationRepository;
import com.example.skip.util.IamportTokenUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // 장바구니에서 결제 검증(예약+예약상세+결제) 생성
    public boolean completeCartItemPayment(PaymentCompleteDTO dto) throws IOException {

        // 1. 토큰 발급
        String accessToken = iamportTokenUtil.getIamportToken();

        // 2. 결제 검증
        Request paymentRequest = new Request.Builder()
                .url("https://api.iamport.kr/payments/" + dto.getImpUid())
                .get()
                .addHeader("Authorization", accessToken)
                .build();

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
                .pgProvider(dto.getPgProvider())
                .status(PaymentStatus.PAID)
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // 렌트 ID 기준으로 그룹핑
        Map<Long, List<PaymentCompleteDTO.ReservationItemDTO>> groupedByRent =
                dto.getReservationItems().stream().collect(Collectors.groupingBy(PaymentCompleteDTO.ReservationItemDTO::getRentId));

        for (Map.Entry<Long, List<PaymentCompleteDTO.ReservationItemDTO>> entry : groupedByRent.entrySet()) {
            Long rentId = entry.getKey();
            List<PaymentCompleteDTO.ReservationItemDTO> items = entry.getValue();

            Rent rent = rentRepository.findById(rentId)
                    .orElseThrow(() -> new IllegalArgumentException("렌트 정보 없음"));

            long reservationTotal = items.stream().mapToLong(PaymentCompleteDTO.ReservationItemDTO::getSubtotalPrice).sum();

            Reservation reservation = Reservation.builder()
                    .user(user)
                    .rent(rent)
                    .totalPrice(reservationTotal)
                    .merchantUid(merchantUid)
                    .impUid(dto.getImpUid())
                    .payment(payment)
                    .status(ReservationStatus.RESERVED)
                    .build();

            reservationRepository.save(reservation);
            payment.getReservations().add(reservation);

            for (PaymentCompleteDTO.ReservationItemDTO itemDto : items) {
                CartItem cartItem = cartItemRepository.findById(itemDto.getCartId())
                        .orElseThrow(() -> {
                            log.error("카트 아이템 없음! cartId={}", itemDto.getCartId());
                            return new IllegalArgumentException("카트 아이템 없음: " + itemDto.getCartId());
                        });

                ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(cartItem.getItemDetail().getItemDetailId())
                        .orElseThrow(() -> new IllegalArgumentException("아이템 상세 정보 없음"));

                // 예약 가능 여부 확인 (재고 차감 X)
                int reservedQuantity = reservationItemRepository.getReservedQuantity(
                        itemDetail.getItemDetailId(),
                        cartItem.getRentStart(),
                        cartItem.getRentEnd()
                );

                int availableStock = itemDetail.getStockQuantity() - reservedQuantity;
                if (availableStock < cartItem.getQuantity()) {
                    throw new IllegalStateException("예약 가능한 수량이 부족합니다. 남은 수량: " + availableStock);
                }

                //예약만 생성 (재고 차감은 스케줄러에서)
                ReservationItem reservationItem = ReservationItem.builder()
                        .reservation(reservation)
                        .itemDetail(itemDetail)
                        .rentStart(cartItem.getRentStart())
                        .rentEnd(cartItem.getRentEnd())
                        .quantity(cartItem.getQuantity())
                        .subtotalPrice(itemDto.getSubtotalPrice())
                        .stockDeducted(false)  // <- 핵심
                        .build();

                reservationItemRepository.save(reservationItem);

                // 장바구니 삭제
                cartItemRepository.delete(cartItem);
            }
        }

        return true;
    }


    public boolean completeDirectPayment(PaymentDirectDTO dto) throws IOException {
        // 1. 결제 검증
        String token = iamportTokenUtil.getIamportToken();

        Request request = new Request.Builder()
                .url("https://api.iamport.kr/payments/" + dto.getImpUid())
                .get()
                .addHeader("Authorization", token)
                .build();

        long paidAmount;
        String merchantUid;

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("결제 조회 실패");

            JsonNode paymentInfo = objectMapper.readTree(response.body().string()).get("response");
            paidAmount = paymentInfo.get("amount").asLong();
            merchantUid = paymentInfo.get("merchant_uid").asText();
        }

        if (!dto.getAmount().equals(paidAmount)) {
            throw new IllegalStateException("결제 금액 불일치");
        }

        // 2. 유저 조회
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        Long totalPrice = dto.getReservationItems().stream()
                .mapToLong(PaymentDirectDTO.ReservationItemDTO::getSubtotalPrice)
                .sum();

        // 3. Payment 생성
        Payment payment = Payment.builder()
                .merchantUid(merchantUid)
                .impUid(dto.getImpUid())
                .totalPrice((double) totalPrice)
                .commissionRate(0.1)
                .adminPrice(totalPrice * 0.1)
                .rentPrice(totalPrice * 0.9)
                .method("card")
                .pgProvider(dto.getPgProvider())
                .status(PaymentStatus.PAID)
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // 4. rentId별로 묶어서 Reservation 생성
        Map<Long, List<PaymentDirectDTO.ReservationItemDTO>> groupedByRent =
                dto.getReservationItems().stream().collect(Collectors.groupingBy(PaymentDirectDTO.ReservationItemDTO::getRentId));

        for (Map.Entry<Long, List<PaymentDirectDTO.ReservationItemDTO>> entry : groupedByRent.entrySet()) {
            Long rentId = entry.getKey();
            List<PaymentDirectDTO.ReservationItemDTO> items = entry.getValue();

            Rent rent = rentRepository.findById(rentId)
                    .orElseThrow(() -> new IllegalArgumentException("렌트 없음"));

            long reservationTotal = items.stream().mapToLong(PaymentDirectDTO.ReservationItemDTO::getSubtotalPrice).sum();

            Reservation reservation = Reservation.builder()
                    .user(user)
                    .rent(rent)
                    .totalPrice(reservationTotal)
                    .merchantUid(merchantUid)
                    .impUid(dto.getImpUid())
                    .payment(payment)
                    .status(ReservationStatus.RESERVED)
                    .build();

            reservationRepository.save(reservation);
            payment.getReservations().add(reservation);

            for (PaymentDirectDTO.ReservationItemDTO item : items) {
                ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(item.getItemDetailId())
                        .orElseThrow(() -> new IllegalArgumentException("아이템 상세 없음"));

                // 재고 차감 없이 예약 가능 여부 확인
                int reservedQuantity = reservationItemRepository.getReservedQuantity(
                        itemDetail.getItemDetailId(),
                        LocalDateTime.parse(item.getRentStart()),
                        LocalDateTime.parse(item.getRentEnd())
                );

                int availableStock = itemDetail.getStockQuantity() - reservedQuantity;
                if (availableStock < item.getQuantity()) {
                    throw new IllegalStateException("예약 가능한 수량 부족 (남은 수량: " + availableStock + ")");
                }

                // 예약만 저장 (재고 차감은 스케줄러에서)
                ReservationItem reservationItem = ReservationItem.builder()
                        .reservation(reservation)
                        .itemDetail(itemDetail)
                        .rentStart(LocalDateTime.parse(item.getRentStart()))
                        .rentEnd(LocalDateTime.parse(item.getRentEnd()))
                        .quantity(item.getQuantity())
                        .subtotalPrice(item.getSubtotalPrice())
                        .stockDeducted(false)
                        .build();

                reservationItemRepository.save(reservationItem);
            }
        }

        return true;
    }

}