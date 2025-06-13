package com.example.skip.repository.refund;

import com.example.skip.entity.RefundsHistory;
import com.example.skip.enumeration.RefundStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


public interface RefundsHistoryRespositoryCustom {
    List<RefundsHistory> findWithFilters(Long userId, Long rentId, RefundStatus status,
                                         LocalDateTime startDate, LocalDateTime endDate,String sort);

}
