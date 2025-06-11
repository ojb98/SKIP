package com.example.skip.repository;

import com.example.skip.entity.Rent;
import com.example.skip.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 관리자ID 기준 예약 + 아이템 정보까지 모두 fetch
    @Query("SELECT DISTINCT r FROM Reservation r " +
            "JOIN FETCH r.rent rent " +
            "JOIN FETCH r.reservationItems ri " +
            "JOIN FETCH ri.itemDetail id " +
            "JOIN FETCH id.item i " +
            "WHERE rent.user.userId = :userId")
    List<Reservation> findReservationsByUserId(@Param("userId") Long userId);



}