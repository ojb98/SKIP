package com.example.skip.repository;

import com.example.skip.entity.Reservations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationsRepository extends JpaRepository<Reservations, Long> {
}