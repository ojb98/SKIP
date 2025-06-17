package com.example.skip.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

@Rollback(false)
@Transactional
@SpringBootTest
public class ReservationServiceTest {
    @Autowired
    private ReservationService reservationService;


}
