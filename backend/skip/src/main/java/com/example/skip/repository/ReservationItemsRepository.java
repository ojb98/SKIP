package com.example.skip.repository;

import com.example.skip.entity.ReservationItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationItemsRepository extends JpaRepository<ReservationItem, Long> {
}