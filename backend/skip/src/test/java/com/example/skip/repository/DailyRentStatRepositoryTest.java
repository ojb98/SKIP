package com.example.skip.repository;

import com.example.skip.entity.DailyRentStat;
import com.example.skip.entity.Rent;
import com.example.skip.repository.reservation.ReservationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Rollback(value = false)
@Transactional
@SpringBootTest
public class DailyRentStatRepositoryTest {
    @Autowired
    private DailyRentStatRepository dailyRentStatRepository;

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private ReservationRepository reservationRepository;


    @Test
    public void statTest() {
        for (int i = 0; i < 30; i++) {
            LocalDate now = LocalDate.now().minusDays(i);
            LocalDate statDate = now.minusDays(1 + i);
            List<Rent> rents = rentRepository.findAll();

            for (Rent rent: rents) {
                Long reservationCount = reservationRepository.countByRentAndCreatedAtAfterAndCreatedAtLessThan(rent, statDate.atStartOfDay(), now.atStartOfDay());
                dailyRentStatRepository.save(DailyRentStat.builder()
                        .rent(rent)
                        .region(rent.getRegion())
                        .reservationCount(reservationCount.intValue())
                        .statDate(statDate)
                        .build());
            }
        }
    }
}
