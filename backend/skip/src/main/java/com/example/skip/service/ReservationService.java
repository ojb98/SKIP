package com.example.skip.service;

import com.example.skip.dto.ReservationDTO;
import com.example.skip.entity.*;
import com.example.skip.repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {
    private final UserRepository userRepository;
    private final RentRepository rentRepository;
    private final CartItemRepository cartItemRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;


    // 예약 등록
    public ReservationDTO createReservation(ReservationDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        Rent rent = rentRepository.findById(dto.getRentId())
                .orElseThrow(() -> new IllegalArgumentException("렌트 없음"));

        // 예약 생성
        Reservation reservation = Reservation.builder()
                .user(user)
                .rent(rent)
                .totalPrice(dto.getTotalPrice())
                .merchantUid(dto.getMerchantUid())
                .impUid(dto.getImpUid())
                .build();
        reservation = reservationRepository.save(reservation);

        List<ReservationDTO.ReservationItemDTO> reservationItemDTOList = new ArrayList<>();
        for (ReservationDTO.ReservationItemDTO itemDto : dto.getReservationItems()) {
            CartItem cartItem = cartItemRepository.findById(itemDto.getCartItemId())
                    .orElseThrow(() -> new IllegalArgumentException("카트 아이템 없음: " + itemDto.getCartItemId()));

            ReservationItem reservationItem = ReservationItem.builder()
                    .reservation(reservation)
                    .itemDetail(cartItem.getItemDetail())
                    .rentStart(cartItem.getRentStart())
                    .rentEnd(cartItem.getRentEnd())
                    .quantity(cartItem.getQuantity())
                    .subtotalPrice((long) cartItem.getQuantity() * cartItem.getPrice())
                    .build();

            reservationItemRepository.save(reservationItem);

            // 응답용 DTO에 담기
            ReservationDTO.ReservationItemDTO responseItemDto = new ReservationDTO.ReservationItemDTO();
            responseItemDto.setCartItemId(cartItem.getCartId());
            responseItemDto.setRentStart(cartItem.getRentStart());
            responseItemDto.setRentEnd(cartItem.getRentEnd());
            responseItemDto.setQuantity(cartItem.getQuantity());
            responseItemDto.setSubtotalPrice(reservationItem.getSubtotalPrice());

            reservationItemDTOList.add(responseItemDto);

            // 장바구니 항목 삭제(필요 시)
            // cartItemRepository.delete(cartItem);
        }

        // 전체 응답 DTO 구성
        ReservationDTO result = new ReservationDTO();
        result.setReserveId(reservation.getReserveId());
        result.setUserId(user.getUserId());
        result.setRentId(rent.getRentId());
        result.setTotalPrice(reservation.getTotalPrice());
        result.setCreatedAt(reservation.getCreatedAt());
        result.setMerchantUid(reservation.getMerchantUid());
        result.setImpUid(reservation.getImpUid());
        result.setReservationItems(reservationItemDTOList);

        return result;
    }

}
