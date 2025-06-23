package com.example.skip.service;

import com.example.skip.dto.payment.*;
import com.example.skip.entity.*;
import com.example.skip.enumeration.PaymentErrorCode;
import com.example.skip.enumeration.PaymentStatus;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.exception.PaymentException;
import com.example.skip.repository.*;
import com.example.skip.repository.reservation.ReservationItemRepository;
import com.example.skip.repository.reservation.ReservationRepository;
import com.example.skip.util.IamportTokenUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)   //커밋된 데이터만 읽을 수 있다
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

    // 장바구니 결제(결제 전처리)
    public PaymentPrepareRespDTO prepareCartPayment(PaymentCartPrepareDTO dto) {
        // 1. 유저 확인
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new PaymentException(PaymentErrorCode.USER_NOT_FOUND));

        // 2. merchantUid 생성
        String merchantUid = "cartOrder_" + System.currentTimeMillis();

        // 3. 총 결제 금액 계산
        long totalPrice = dto.getReservationItems().stream()
                .mapToLong(PaymentCartPrepareDTO.CartReservationItemDTO::getSubtotalPrice)
                .sum();

        // 4. 결제 엔티티 생성 및 저장
        Payment payment = Payment.builder()
                .merchantUid(merchantUid)
                .impUid(null) // 결제 전
                .totalPrice((double) totalPrice)
                .commissionRate(0.1)
                .adminPrice(totalPrice * 0.1)
                .rentPrice(totalPrice * 0.9)
                .method("card")
                .status(PaymentStatus.READY)
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // 5. rentId 별로 그룹핑
        Map<Long, List<PaymentCartPrepareDTO.CartReservationItemDTO>> groupedByRent =
                dto.getReservationItems().stream()
                        .collect(Collectors.groupingBy(PaymentCartPrepareDTO.CartReservationItemDTO::getRentId));

        for (Map.Entry<Long, List<PaymentCartPrepareDTO.CartReservationItemDTO>> entry : groupedByRent.entrySet()) {
            Long rentId = entry.getKey();
            List<PaymentCartPrepareDTO.CartReservationItemDTO> items = entry.getValue();

            Rent rent = rentRepository.findById(rentId)
                    .orElseThrow(() -> new PaymentException(PaymentErrorCode.RENT_NOT_FOUND));

            long rentTotal = items.stream()
                    .mapToLong(PaymentCartPrepareDTO.CartReservationItemDTO::getSubtotalPrice)
                    .sum();

            Reservation reservation = Reservation.builder()
                    .user(user)
                    .rent(rent)
                    .totalPrice(rentTotal)
                    .merchantUid(merchantUid)
                    .status(ReservationStatus.READY)
                    .payment(payment)
                    .build();

            reservationRepository.save(reservation);
            payment.getReservations().add(reservation);

            // 예약 상세 저장
            for (PaymentCartPrepareDTO.CartReservationItemDTO item : items) {
                CartItem cartItem = cartItemRepository.findById(item.getCartId())
                        .orElseThrow(() -> new PaymentException(PaymentErrorCode.CART_ITEM_NOT_FOUND));

                ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(cartItem.getItemDetail().getItemDetailId())
                        .orElseThrow(() -> new PaymentException(PaymentErrorCode.ITEM_DETAIL_NOT_FOUND));

                int reservedQty = reservationItemRepository.getReservedQuantity(
                        itemDetail.getItemDetailId(),
                        LocalDateTime.parse(item.getRentStart()),
                        LocalDateTime.parse(item.getRentEnd())
                );

                int availableStock = itemDetail.getStockQuantity() - reservedQty;

                if (availableStock < item.getQuantity()) {
                    throw new PaymentException(PaymentErrorCode.STOCK_SHORTAGE, "남은 수량: " + availableStock);
                }

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
                cartItemRepository.delete(cartItem);
            }
        }

        return new PaymentPrepareRespDTO(merchantUid, totalPrice);
    }


    // 바로 결제(결제 전 처리)
    public PaymentPrepareRespDTO preparePayment(PaymentPrepareDTO dto) {
        // 유저 확인
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new PaymentException(PaymentErrorCode.USER_NOT_FOUND));

        // merchantUid 생성
        String merchantUid = "order_" + System.currentTimeMillis();

        // 총 금액 계산
        long totalPrice = dto.getReservationItems().stream()
                .mapToLong(PaymentPrepareDTO.ReservationItemDTO::getSubtotalPrice)
                .sum();

        Payment payment = Payment.builder()
                .merchantUid(merchantUid)
                .impUid(null) // 아직 결제 전
                .totalPrice((double) totalPrice)
                .commissionRate(0.1)
                .adminPrice(totalPrice * 0.1)
                .rentPrice(totalPrice * 0.9)
                .status(PaymentStatus.READY)
                .method("card")
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // RentId별로 묶어서 Reservation 생성
        Map<Long, List<PaymentPrepareDTO.ReservationItemDTO>> groupedByRent =
                dto.getReservationItems().stream()
                        .collect(Collectors.groupingBy(PaymentPrepareDTO.ReservationItemDTO::getRentId));

        for (Map.Entry<Long, List<PaymentPrepareDTO.ReservationItemDTO>> entry : groupedByRent.entrySet()) {
            Long rentId = entry.getKey();
            List<PaymentPrepareDTO.ReservationItemDTO> items = entry.getValue();

            Rent rent = rentRepository.findById(rentId)
                    .orElseThrow(() -> new PaymentException(PaymentErrorCode.RENT_NOT_FOUND));

            long rentTotal = items.stream()
                    .mapToLong(PaymentPrepareDTO.ReservationItemDTO::getSubtotalPrice)
                    .sum();

            Reservation reservation = Reservation.builder()
                    .user(user)
                    .rent(rent)
                    .totalPrice(rentTotal)
                    .merchantUid(merchantUid)
                    .status(ReservationStatus.READY)
                    .payment(payment)
                    .build();

            reservationRepository.save(reservation);
            payment.getReservations().add(reservation);

            for (PaymentPrepareDTO.ReservationItemDTO item : items) {
                ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(item.getItemDetailId())
                        .orElseThrow(() -> new PaymentException(PaymentErrorCode.ITEM_DETAIL_NOT_FOUND));

                int reservedQty = reservationItemRepository.getReservedQuantity(
                        itemDetail.getItemDetailId(),
                        LocalDateTime.parse(item.getRentStart()),
                        LocalDateTime.parse(item.getRentEnd())
                );

                int availableStock = itemDetail.getStockQuantity() - reservedQty;

                if (availableStock < item.getQuantity()) {
                    throw new PaymentException(PaymentErrorCode.STOCK_SHORTAGE, "남은 수량: " + availableStock);
                }

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

        return new PaymentPrepareRespDTO(merchantUid,totalPrice);
    }

    //결제처리
    public void confirmPayment(PaymentConfirmDTO dto) throws IOException {
        if (dto.getAmount() == null) {
            throw new PaymentException(PaymentErrorCode.AMOUNT_MISMATCH, "결제 금액이 누락되었습니다.");
        }

        String token = iamportTokenUtil.getIamportToken();
        // 1단계: 사전 등록 (중복 결제 방지 + 미등록 UID 차단)
        iamportTokenUtil.prepareIamportPayment(token, dto.getMerchantUid(),  dto.getAmount());

        // 2단계: 실제 결제 후, imp_uid로 결과 조회 및 검증
        Request request = new Request.Builder()
                .url("https://api.iamport.kr/payments/" + dto.getImpUid())
                .get()
                .addHeader("Authorization", token)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new PaymentException(PaymentErrorCode.PAYMENT_VERIFICATION_FAILED);
            }

            // imp_uid로 아임포트에 직접 결제 내역을 조회해 신뢰 가능한 방식으로 금액을 재검증
            JsonNode json = objectMapper.readTree(response.body().string()).get("response");
            long actualAmount = json.get("amount").asLong();

            if (actualAmount != dto.getAmount()) {
                throw new PaymentException(PaymentErrorCode.AMOUNT_MISMATCH);
            }
        }

        Payment payment = paymentRepository.findByMerchantUid(dto.getMerchantUid())
                .orElseThrow(() -> new PaymentException(PaymentErrorCode.PAYMENT_NOT_FOUND));

        //프론트에서 넘어온 유저아이디과 디비에 예약된 아이디가 같은지 비교
        if (!payment.getReservations().isEmpty()) {
            for (Reservation reservation : payment.getReservations()) {
                User user = reservation.getUser();
                log.info("예약된 유저 ID: {}", user != null ? user.getUserId() : "null");
                log.info("요청한 유저 ID: {}", dto.getUserId());
            }

            boolean anyMismatch = payment.getReservations().stream()
                    .anyMatch(reservation ->
                            !Objects.equals(
                                    reservation.getUser() != null ? reservation.getUser().getUserId() : null,
                                    dto.getUserId()
                            )
                    );

            if (anyMismatch) {
                throw new PaymentException(PaymentErrorCode.USER_MISMATCH, "결제 요청자와 예약한 사용자가 다릅니다.");
            }
        }

        payment.setImpUid(dto.getImpUid());
        payment.setPgProvider(dto.getPgProvider());
        payment.setStatus(PaymentStatus.PAID);

        for (Reservation reservation : payment.getReservations()) {
            reservation.setImpUid(dto.getImpUid());
            reservation.setStatus(ReservationStatus.RESERVED);
        }
    }


    // ================================= 예전코드 ===================================================
    // ** 장바구니에서 결제 (보상 트랜잭션(Compensating Transaction)을 적용) **
    public boolean completeCartItemPayment(PaymentCompleteDTO dto) throws IOException {
        // 1. 토큰 발급
        String accessToken = iamportTokenUtil.getIamportToken();
        String impUid = dto.getImpUid();

        try{
            // 2. 결제 검증
            // Request : OkHttp 라이브러리를 사용하여 HTTP 요청을 생성
            Request paymentRequest = new Request.Builder()
                    .url("https://api.iamport.kr/payments/" + dto.getImpUid())
                    .get()
                    .addHeader("Authorization", accessToken)
                    .build();

            long paidAmount;
            String merchantUid;

            // client.newCall(paymentRequest) : 전달한 Request 객체를 바탕으로 Call 객체를 생성
            // execute() : 동기 방식으로 아임포트 API 요청 실행
            try (Response paymentResponse = client.newCall(paymentRequest).execute()) {
                if (!paymentResponse.isSuccessful()) {
                    throw new PaymentException(PaymentErrorCode.PAYMENT_VERIFICATION_FAILED,
                            "결제 정보 조회 실패: " + paymentResponse);
                }

                // JsonNode : JSON 데이터 구조를 트리(Tree) 형태로 표현하는 객체(Jackson 라이브러리)
                // 응답 JSON을 파싱해 response 객체 추출
                // 실제 결제 금액(amount)과 주문번호(merchant_uid)를 읽어 변수에 저장
                JsonNode paymentInfo = objectMapper.readTree(paymentResponse.body().string()).get("response");
                paidAmount = paymentInfo.get("amount").asLong();
                merchantUid = paymentInfo.get("merchant_uid").asText();
            }

            // 3. 금액 검증 (프론트에서 보낸 금액(dto.getAmount())과 아임포트(paidAmount)에서 조회한 금액이 일치하는지 검증)
            if (!dto.getAmount().equals(paidAmount)) {
                throw new PaymentException(PaymentErrorCode.AMOUNT_MISMATCH);
            }

            //유저 정보
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new PaymentException(PaymentErrorCode.USER_NOT_FOUND));

            // 모든 예약 항목의 소계 금액을 합산하여 totalPrice 계산
            // reservationItems 리스트를 스트림(데이터 흐름) 형태로 변환
            Long totalPrice = dto.getReservationItems().stream()
                    // .mapToLong : long 값으로 매핑
                    // ReservationItemDTO 객체에서 getSubtotalPrice() 값 꺼내기
                    .mapToLong(PaymentCompleteDTO.ReservationItemDTO::getSubtotalPrice)
                    .sum();  // .sum() : 모든 long 값들을 더해서 총합

            // 5. Payment 생성
            Payment payment = Payment.builder()
                    .merchantUid(merchantUid)
                    .impUid(dto.getImpUid())
                    .totalPrice((double) totalPrice)
                    .commissionRate(0.1)   //수수료 10%
                    .adminPrice(totalPrice * 0.1)  //총액의 10%
                    .rentPrice(totalPrice * 0.9)   //총액의 90%
                    .method("card")
                    .pgProvider(dto.getPgProvider())
                    .status(PaymentStatus.PAID)   //결제 상태(성공)
                    .createdAt(LocalDateTime.now())
                    .build();

            paymentRepository.save(payment);

            // ** rentId별로 예약 항목들을 묶기(rentId = 1에 해당하는 아이템들) **
            Map<Long, List<PaymentCompleteDTO.ReservationItemDTO>> groupedByRent =
                    //getReservationItems() 안에 있는 예약 항목 리스트를 가져오기
                    dto.getReservationItems().stream()
                            // .collect() : 최종적으로 결과로 수집(스트림의 마지막 단계)
                            // .groupingBy : 특정 키 기준으로 그룹핑(같은 키를 가진 데이터를 그룹핑할 때)
                            .collect(Collectors.groupingBy(PaymentCompleteDTO.ReservationItemDTO::getRentId));

            // rentId 그룹별로 예약 생성
            // Map.Entry<K, V> : 맵 안에 있는 키와 값 쌍을 나타내는 객체
            // Map은 인터페이스로, entrySet() 메서드는 Set<Map.Entry<K,V>>를 반환
            // .entrySet()으로 쌍(key-value) 목록을 꺼내고, 그걸 스트림으로 변환해서 유연하게 처리하기 위해서
            for (Map.Entry<Long, List<PaymentCompleteDTO.ReservationItemDTO>> entry : groupedByRent.entrySet()) {
                Long rentId = entry.getKey();   // 키: rentId
                List<PaymentCompleteDTO.ReservationItemDTO> items = entry.getValue(); // 값: rentId별 예약 항목 리스트

                Rent rent = rentRepository.findById(rentId)
                        .orElseThrow(() -> new PaymentException(PaymentErrorCode.RENT_NOT_FOUND));

                // rentId에 속한 예약 항목들의 subtotalPrice를 모두 더해서 이 reservation의 총 가격을 계산
                long reservationTotal =
                        items.stream().mapToLong(PaymentCompleteDTO.ReservationItemDTO::getSubtotalPrice).sum();

                //예약
                Reservation reservation = Reservation.builder()
                        .user(user)
                        .rent(rent)
                        .totalPrice(reservationTotal)
                        .merchantUid(merchantUid)
                        .impUid(dto.getImpUid())
                        .payment(payment)
                        .status(ReservationStatus.RESERVED)    //예약
                        .build();

                reservationRepository.save(reservation);
                // payment 객체의 예약 목록(reservations)에 새로 생성한 reservation 객체를 추가(양방향 연관관계)
                payment.getReservations().add(reservation);

                //예약 상세
                for (PaymentCompleteDTO.ReservationItemDTO itemDto : items) {
                    CartItem cartItem = cartItemRepository.findById(itemDto.getCartId())
                            .orElseThrow(() -> new PaymentException(PaymentErrorCode.CART_ITEM_NOT_FOUND));

                    //예약 가능 수량 검증 시점의 정확성 보장(이 아이템의 재고 및 예약을 동시에 판단하는 것 막기)
                    ItemDetail itemDetail = itemDetailRepository.findByIdWithLock(cartItem.getItemDetail().getItemDetailId())
                            .orElseThrow(() -> new PaymentException(PaymentErrorCode.ITEM_DETAIL_NOT_FOUND));

                    // 예약 가능 여부 확인 (재고 확인을 위한 사전 점검)
                    // 해당 장비(ItemDetail)의 대여 기간 내 이미 예약된 수량
                    int reservedQuantity = reservationItemRepository.getReservedQuantity(
                            itemDetail.getItemDetailId(),
                            cartItem.getRentStart(),
                            cartItem.getRentEnd()
                    );

                    // 남은 예약 가능 수량을 계산
                    int availableStock = itemDetail.getStockQuantity() - reservedQuantity;
                    if (availableStock < cartItem.getQuantity()) {
                        throw new PaymentException(PaymentErrorCode.STOCK_SHORTAGE,"남은 수량 - " + availableStock);
                    }

                    //예약만 생성 (재고 차감은 스케줄러에서 rentStart 맞춰서 차감)
                    ReservationItem reservationItem = ReservationItem.builder()
                            .reservation(reservation)
                            .itemDetail(itemDetail)
                            .rentStart(cartItem.getRentStart())
                            .rentEnd(cartItem.getRentEnd())
                            .quantity(cartItem.getQuantity())
                            .subtotalPrice(itemDto.getSubtotalPrice())
                            // false - 재고는 아직 차감하지 않았고, 스케줄러가 후속 작업에서 처리하기 때문
                            .stockDeducted(false)
                            .build();

                    reservationItemRepository.save(reservationItem);

                    // 장바구니 삭제
                    cartItemRepository.delete(cartItem);
                }
            }

            return true;

        }catch(Exception e){ //결제 후 예약 처리 중 예외가 발생했을 때, 자동으로 결제를 취소하는 로직
            log.error("결제 후 예약 처리 실패: {}", e.getMessage(), e);
            try {
                // 자동 환불 요청
                cancelPayment(impUid, accessToken, "예약 처리 실패로 인한 환불");
                log.info("결제 자동 취소 완료 (impUid: {})", impUid);
            } catch (Exception cancelEx) {
                log.error("자동 환불 실패: {}", cancelEx.getMessage(), cancelEx);
            }
            throw e; // 그대로 다시 던져서 상위 컨트롤러에 전달
        }
    }


    //바로결제
    public boolean completeDirectPayment(PaymentDirectDTO dto) throws IOException {
        String token = iamportTokenUtil.getIamportToken();
        String impUid = dto.getImpUid();

        try {
            // 1. 결제 검증
            Request request = new Request.Builder()
                    .url("https://api.iamport.kr/payments/" + impUid)
                    .get()
                    .addHeader("Authorization", token)
                    .build();

            long paidAmount;
            String merchantUid;

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new PaymentException(PaymentErrorCode.PAYMENT_VERIFICATION_FAILED,
                            "HTTP 상태: " + response.code());
                }

                JsonNode paymentInfo = objectMapper.readTree(response.body().string()).get("response");
                paidAmount = paymentInfo.get("amount").asLong();
                merchantUid = paymentInfo.get("merchant_uid").asText();
            }

            if (!dto.getAmount().equals(paidAmount)) {
                throw new PaymentException(PaymentErrorCode.AMOUNT_MISMATCH);
            }

            // 2. 유저 조회
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new PaymentException(PaymentErrorCode.USER_NOT_FOUND));

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
                    dto.getReservationItems().stream()
                            .collect(Collectors.groupingBy(PaymentDirectDTO.ReservationItemDTO::getRentId));

            for (Map.Entry<Long, List<PaymentDirectDTO.ReservationItemDTO>> entry : groupedByRent.entrySet()) {
                Long rentId = entry.getKey();
                List<PaymentDirectDTO.ReservationItemDTO> items = entry.getValue();

                Rent rent = rentRepository.findById(rentId)
                        .orElseThrow(() -> new PaymentException(PaymentErrorCode.RENT_NOT_FOUND));

                long reservationTotal = items.stream()
                        .mapToLong(PaymentDirectDTO.ReservationItemDTO::getSubtotalPrice)
                        .sum();

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
                            .orElseThrow(() -> new PaymentException(PaymentErrorCode.ITEM_DETAIL_NOT_FOUND));

                    int reservedQuantity = reservationItemRepository.getReservedQuantity(
                            itemDetail.getItemDetailId(),
                            LocalDateTime.parse(item.getRentStart()),
                            LocalDateTime.parse(item.getRentEnd())
                    );

                    int availableStock = itemDetail.getStockQuantity() - reservedQuantity;
                    if (availableStock < item.getQuantity()) {
                        throw new PaymentException(PaymentErrorCode.STOCK_SHORTAGE,
                                "남은 수량: " + availableStock);
                    }

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

        } catch (Exception e) {
            log.error("결제 후 예약 처리 실패: {}", e.getMessage(), e);
            try {
                cancelPayment(impUid, token, "예약 처리 실패로 인한 환불");
                log.info("결제 자동 취소 완료 (impUid: {})", impUid);
            } catch (Exception cancelEx) {
                log.error("자동 환불 실패: {}", cancelEx.getMessage(), cancelEx);
            }
            throw e;
        }
    }

    //결제에러시 즉시환불
    public void cancelPayment(String impUid, String accessToken, String reason) throws IOException {
        RequestBody body = new FormBody.Builder()
                .add("reason", reason)
                .add("imp_uid", impUid)
                .build();

        Request request = new Request.Builder()
                .url("https://api.iamport.kr/payments/cancel")
                .post(body)
                .addHeader("Authorization", accessToken)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("환불 실패: " + response.body().string());
            }
        }
    }



}