package com.example.skip.repository.refund;

import com.example.skip.entity.RefundsHistory;
import com.example.skip.entity.ReservationItem;
import com.example.skip.enumeration.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface RefundsHistoryRepository extends JpaRepository<RefundsHistory,Long>,
        QuerydslPredicateExecutor<RefundsHistory>,
        RefundsHistoryRespositoryCustom {

    //해당 예약상세에 대해 지정된 상태(예: COMPLETED) 환불 이력이 있는지 여부 확인
    boolean existsByReservationItemAndStatus(ReservationItem reservationItem, RefundStatus status);
}
