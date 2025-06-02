package com.example.skip.repository;

import com.example.skip.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationsRepository extends JpaRepository<Reservation, Long> {


}
