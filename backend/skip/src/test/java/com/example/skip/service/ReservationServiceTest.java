package com.example.skip.service;

import com.example.skip.dto.ReservationItemsDTO;
import com.example.skip.entity.*;
import com.example.skip.repository.*;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
@Transactional
@Commit
public class ReservationServiceTest {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RentRepository rentRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ReservationsService reservationService;
    @Autowired
    private ReservationsRepository reservationRepository;
    @Autowired
    private ReservationItemsRepository reservationItemRepository;

//    @Test
//    public void reservationInsert(){
//        User user = userRepository.findById(1L).orElseThrow();
//        Rent rent = rentRepository.findById(1L).orElseThrow();
//        Item item1 = itemRepository.findById(1L).orElseThrow();
//        Item item2 = itemRepository.findById(3L).orElseThrow();
//        Item item3 = itemRepository.findById(4L).orElseThrow();
//
//        ReservationItemsDTO dto1 = ReservationItemsDTO.builder()
//                .itemId(item1.getItemId())
//                .rentStart(LocalDateTime.of(2025,06,01,14,00))
//                .quantity(1)
//                .build();
//
//        ReservationItemsDTO dto2 = ReservationItemsDTO.builder()
//                .itemId(item2.getItemId())
//                .rentStart(LocalDateTime.of(2025,06,01,14,00))
//                .quantity(2)
//                .build();
//
//        ReservationItemsDTO dto3 = ReservationItemsDTO.builder()
//                .itemId(item3.getItemId())
//                .rentStart(LocalDateTime.of(2025,06,01,14,00))
//                .quantity(2)
//                .build();
//
//        List<ReservationItemsDTO> items = List.of(dto1, dto2, dto3);
//
//        reservationService.saveReservations(user.getUserId(), rent.getRentId(), items);
//
//        List<Reservations> reservations = reservationRepository.findAll();
//        List<ReservationItems> reservationItems = reservationItemRepository.findAll();
//
//        System.out.println("<<< 예약정보 >>>");
//        reservations.forEach(System.out::println);
//        System.out.println("<<< 예약아이템정보 >>>");
//        reservationItems.forEach(System.out::println);
//
//        Assertions.assertEquals(1, reservations.size());
//        Assertions.assertEquals(3, reservationItems.size());
//    }
}
