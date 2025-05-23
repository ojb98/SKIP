package com.example.skip.service;

import com.example.skip.dto.ReservationItemsDTO;
import com.example.skip.entity.*;
import com.example.skip.enumeration.ReservationStatus;
import com.example.skip.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
@RequiredArgsConstructor
public class ReservationsService {

    private final ReservationsRepository reservationsRepository;
    private final ReservationItemsRepository reservationItemsRepository;
    private final UserRepository userRepository;
    private final RentRepository rentRepository;
    private final ItemRepository itemRepository;

    public void saveReservations(Long userId, Long rentId, List<ReservationItemsDTO> itemDTOs){
        User user = userRepository.findById(userId).orElseThrow();
        Rent rent = rentRepository.findById(rentId).orElseThrow();

        List<ReservationItems> reservationItems = new ArrayList<>();
        long totalPrice = 0L;

        for(ReservationItemsDTO dto : itemDTOs) {
            Item item = itemRepository.findById(dto.getItemId()).orElseThrow();
            LocalDateTime rentStart = dto.getRentStart();
            LocalDateTime rentEnd = rentStart.plusHours(item.getRentHour());
            long subtotal = item.getPrice() * dto.getQuantity();
            totalPrice += subtotal;

            ReservationItems reservationItem = com.example.skip.entity.ReservationItems.builder()
                    .item(item)
                    .rentStart(rentStart)
                    .rentEnd(rentEnd)
                    .quantity(dto.getQuantity())
                    .subtotalPrice(subtotal)
                    .build();

            reservationItems.add(reservationItem);
        }

        Reservations reservation = reservationsRepository.save(
                Reservations.builder()
                        .user(user)
                        .rent(rent)
                        .totalPrice(totalPrice)
                        .status(ReservationStatus.RESERVED)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        for(ReservationItems item : reservationItems) {
            item.setReservations(reservation);
            reservationItemsRepository.save(item);
        }
    }
}
