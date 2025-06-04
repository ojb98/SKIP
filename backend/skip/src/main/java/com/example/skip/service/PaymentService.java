package com.example.skip.service;

import com.example.skip.config.IamPortConfig;
import com.example.skip.dto.ImpAuthRequest;
import com.example.skip.dto.PaymentCompleteDTO;
import com.example.skip.entity.*;
import com.example.skip.enumeration.PaymentStatus;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class PaymentService {

    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final UserRepository userRepository;
    private final ItemDetailRepository itemDetailRepository;
    private final CartItemRepository cartItemRepository;
    private final IamPortConfig iamPortConfig;
    private final PaymentRepository paymentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean completePaymentWithReservation(PaymentCompleteDTO dto) throws IOException {

        // 1. 토큰 발급
        OkHttpClient client = new OkHttpClient();
        String authJson = objectMapper.writeValueAsString(new ImpAuthRequest(iamPortConfig.getApiKey(), iamPortConfig.getSecretKey()));
        RequestBody authBody = RequestBody.create(authJson, MediaType.get("application/json"));
        Request authRequest = new Request.Builder()
                .url("https://api.iamport.kr/users/getToken")
                .post(authBody)
                .build();

        String accessToken;
        try (Response response = client.newCall(authRequest).execute()) {
            if (!response.isSuccessful()) throw new IOException("토큰 요청 실패: " + response);
            String responseBody = response.body().string();
            accessToken = objectMapper.readTree(responseBody).get("response").get("access_token").asText();
        }

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

        // 3. 금액 검증
        if (!dto.getAmount().equals(paidAmount)) {
            throw new IllegalStateException("결제 금액이 일치하지 않습니다.");
        }

        // 4. 예약 생성
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        // 결제 총액은 ReservationItemDTO들의 합산으로 재계산해도 됨
        Long totalPrice = dto.getReservationItems().stream()
                .mapToLong(PaymentCompleteDTO.ReservationItemDTO::getSubtotalPrice)
                .sum();

        // 4. Payment 생성
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

        // 5. Reservation 여러 건 생성 및 Payment에 연결
        for (PaymentCompleteDTO.ReservationItemDTO itemDto : dto.getReservationItems()) {
            CartItem cartItem = cartItemRepository.findById(itemDto.getCartItemId())
                    .orElseThrow(() -> new IllegalArgumentException("카트 아이템 없음: " + itemDto.getCartItemId()));

            Rent rent = cartItem.getItemDetail().getItem().getRent();

            Reservation reservation = Reservation.builder()
                    .user(user)
                    .rent(rent)
                    .totalPrice(itemDto.getSubtotalPrice())
                    .merchantUid(merchantUid)
                    .impUid(dto.getImpUid())
                    .payment(payment)   // 여기서 연관관계 설정
                    .status(ReservationStatus.RESERVED)
                    .build();

            reservationRepository.save(reservation);
            payment.getReservations().add(reservation);

            // 예약 아이템도 생성
            ReservationItem reservationItem = ReservationItem.builder()
                    .reservation(reservation)
                    .itemDetail(cartItem.getItemDetail())
                    .rentStart(cartItem.getRentStart())
                    .rentEnd(cartItem.getRentEnd())
                    .quantity(cartItem.getQuantity())
                    .subtotalPrice(itemDto.getSubtotalPrice())
                    .build();
            reservationItemRepository.save(reservationItem);

            // 락 걸린 상태로 ItemDetail 조회
            ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(cartItem.getItemDetail().getItemDetailId())
                    .orElseThrow(() -> new IllegalArgumentException("아이템 상세 정보 없음"));

            // 재고 차감
            int currentStock = itemDetail.getStockQuantity();
            int reservedQty = cartItem.getQuantity();

            if (currentStock < reservedQty) {
                throw new IllegalStateException("재고가 부족합니다. 남은 수량: " + currentStock);
            }
            itemDetail.setStockQuantity(currentStock - reservedQty);

            // 장바구니 삭제
            cartItemRepository.delete(cartItem);
        }

        return true;
    }

}