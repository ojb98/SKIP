package com.example.skip.service;

import com.example.skip.config.IamPortConfig;
import com.example.skip.dto.ImpAuthRequest;
import com.example.skip.dto.PaymentCompleteDTO;
import com.example.skip.entity.*;
import com.example.skip.enumeration.PaymentStatus;
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
    private final RentRepository rentRepository;
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
        Rent rent = rentRepository.findById(dto.getRentId())
                .orElseThrow(() -> new IllegalArgumentException("렌트 없음"));

        Long totalPrice = dto.getReservationItems().stream()
                .mapToLong(PaymentCompleteDTO.ReservationItemDTO::getSubtotalPrice)
                .sum();

        Reservation reservation = Reservation.builder()
                .user(user)
                .rent(rent)
                .totalPrice(totalPrice)
                .merchantUid(merchantUid)
                .impUid(dto.getImpUid())
                .build();
        reservation = reservationRepository.save(reservation);

        // 5. 예약아이템 생성
        for (PaymentCompleteDTO.ReservationItemDTO itemDto : dto.getReservationItems()) {
            CartItem cartItem = cartItemRepository.findById(itemDto.getCartItemId())
                    .orElseThrow(() -> new IllegalArgumentException("카트 아이템 없음: " + itemDto.getCartItemId()));

            ReservationItem reservationItem = ReservationItem.builder()
                    .reservation(reservation)
                    .itemDetail(cartItem.getItemDetail())
                    .rentStart(cartItem.getRentStart())
                    .rentEnd(cartItem.getRentEnd())
                    .quantity(cartItem.getQuantity())
                    .subtotalPrice(itemDto.getSubtotalPrice())
                    .build();
            reservationItemRepository.save(reservationItem);

            // 6. 재고 차감 로직 추가
            ItemDetail itemDetail = cartItem.getItemDetail();
            int currentStock = itemDetail.getStockQuantity(); // 현재 재고 가져오기
            int reservedQty = cartItem.getQuantity();  // 사용자가 예약한 수량

            if (currentStock < reservedQty) {
                throw new IllegalStateException("재고가 부족합니다. 남은 수량: " + currentStock);
            }
            // 현재 재고 - 예약 수량 = 남은 재고
            itemDetail.setStockQuantity(currentStock - reservedQty);

            // 7.  장바구니 항목 제거(선택)
            cartItemRepository.delete(cartItem);
        }
        // 8. 결제 정보 저장
        double commissionRate = 0.1;  //10% 수수료
        double adminPrice = totalPrice * commissionRate;
        double rentPrice = totalPrice - adminPrice;

        Payment payment = Payment.builder()
                .reservation(reservation)
                .merchantUid(merchantUid)
                .impUid(dto.getImpUid())
                .totalPrice((double) totalPrice) // Long -> Double 변환
                .commissionRate(commissionRate)
                .adminPrice(adminPrice)
                .rentPrice(rentPrice)
                .method("card") // 또는 실제 결제 수단을 포트원 응답에서 받아올 수도 있음
                .pgProvider("kakaopay.TC0ONETIME") // 또는 실제 응답에서 추출
                .status(PaymentStatus.PAID)
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        return true;
    }

}
