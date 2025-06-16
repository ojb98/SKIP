package com.example.skip.repository;

import com.example.skip.entity.Payment;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.enumeration.PaymentStatus;
import com.example.skip.enumeration.ReservationStatus;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;
import java.util.Date;

@Rollback(value = false)
@Transactional
@SpringBootTest
public class ReservationRepositoryTest {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationItemRepository reservationItemRepository;

    @Autowired
    private ItemDetailRepository itemDetailRepository;

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private PaymentRepository paymentRepository;


//    @Test
//    public void save() {
//        for (int i = 0; i < 10; i++) {
//            Payment payment = paymentRepository.saveAndFlush(Payment.builder()
//                    .totalPrice(100000D)
//                    .adminPrice(20000D)
//                    .rentPrice(80000D)
//                    .commissionRate(20D)
//                    .impUid("impUid")
//                    .merchantUid("merchantUid")
//                    .status(PaymentStatus.PAID)
//                    .build());
//
//            Reservation reservation = reservationRepository.saveAndFlush(Reservation.builder()
//                    .rent(rentRepository.findById(1L).get())
//                    .user(userRepository.findById(1L).get())
//                    .payment(payment)
//                    .totalPrice(100000L)
//                    .merchantUid("merchantUid")
//                    .impUid("impUid")
//                    .status(ReservationStatus.RESERVED)
//                    .build());
//
//            for (int j = 0; j < 4; j++) {
//                reservationItemRepository.saveAndFlush(ReservationItem.builder()
//                        .itemDetail(itemDetailRepository.findById(1L).get())
//                        .reservation(reservation)
//                        .rentStart(LocalDateTime.now())
//                        .rentEnd(LocalDateTime.now().plusDays(3))
//                        .quantity(3)
//                        .subtotalPrice(25000L)
//                        .isReturned(false).build());
//            }
//        }
//    }
}
