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
                .build();
        reservation = reservationRepository.save(reservation);

        List<ReservationDTO.ReservationItemDTO> reservationItemDTOList = new ArrayList<>();

        for (Long cartId : dto.getCartIds()) {
            CartItem cartItem = cartItemRepository.findById(cartId)
                    .orElseThrow(() -> new IllegalArgumentException("장바구니 항목 없음: " + cartId));

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
            ReservationDTO.ReservationItemDTO itemDTO = new ReservationDTO.ReservationItemDTO();
            itemDTO.setItemDetailId(cartItem.getItemDetail().getItemDetailId());
            itemDTO.setRentStart(cartItem.getRentStart());
            itemDTO.setRentEnd(cartItem.getRentEnd());
            itemDTO.setQuantity(cartItem.getQuantity());
            itemDTO.setSubtotalPrice((long) cartItem.getQuantity() * cartItem.getPrice());
            reservationItemDTOList.add(itemDTO);

            // 장바구니 항목 삭제 (선택적)
            cartItemRepository.delete(cartItem);
        }

        // 응답 DTO 구성
        ReservationDTO result = new ReservationDTO();
        result.setReserveId(reservation.getReserveId());
        result.setUserId(user.getUserId());
        result.setRentId(rent.getRentId());
        result.setTotalPrice(reservation.getTotalPrice());
        result.setCreatedAt(reservation.getCreatedAt());
        result.setReservationItems(reservationItemDTOList);

        return result;
    }

}
