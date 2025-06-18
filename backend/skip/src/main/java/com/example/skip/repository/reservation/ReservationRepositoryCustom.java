package com.example.skip.repository.reservation;

import com.example.skip.entity.Reservation;
import com.example.skip.enumeration.ReservationStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepositoryCustom {
    List<Reservation> findWithFilters(Long userId,
                                      Long rentId,
                                      ReservationStatus status,
                                      LocalDateTime rentStart,
                                      LocalDateTime rentEnd,
                                      String keyword);

}
