package com.example.skip.service;

import com.example.skip.dto.reservation.ReservationDetailDTO;
import com.example.skip.dto.reservation.ReservationGroupDTO;
import com.example.skip.entity.Rent;
import com.example.skip.entity.Reservation;
import com.example.skip.entity.ReservationItem;
import com.example.skip.repository.RentRepository;
import com.example.skip.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public List<ReservationGroupDTO> getGroupedReservationsByUserId(Long userId) {

        List<Reservation> reservations = reservationRepository.findReservationsByUserId(userId);

        // merchantUid 별로 그룹핑하기
        Map<String, ReservationGroupDTO> groupedMap = new LinkedHashMap<>();

        for (Reservation r : reservations) {
            String merchantUid = r.getMerchantUid();

            ReservationGroupDTO group = groupedMap.get(merchantUid);
            if (group == null) {
                group = ReservationGroupDTO.builder()
                        .merchantUid(merchantUid)
                        .rentId(r.getRent().getRentId())
                        .rentName(r.getRent().getName())
                        .username(r.getUser().getUsername())
                        .status(r.getStatus().name())
                        .totalPrice(0)
                        .createdAt(r.getCreatedAt())
                        .reserveIds(new ArrayList<>())
                        .items(new ArrayList<>())
                        .build();
                groupedMap.put(merchantUid, group);
            }

            group.getReserveIds().add(r.getReserveId());

            // 각 Reservation의 ReservationItem 들을 ReservationDetailDTO로 변환
            for (ReservationItem ri : r.getReservationItems()) {
                group.getItems().add(ReservationDetailDTO.from(ri));
                group.setTotalPrice(group.getTotalPrice() + ri.getSubtotalPrice().intValue());
            }
        }

        return new ArrayList<>(groupedMap.values());
    }
}


