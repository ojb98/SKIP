package com.example.skip.repository;

import com.example.skip.entity.ReservationItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationItemsRepository extends JpaRepository<ReservationItems, Long> {
}
