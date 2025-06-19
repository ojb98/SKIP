package com.example.skip.view;

import com.blazebit.persistence.view.EntityView;
import com.blazebit.persistence.view.IdMapping;
import com.example.skip.entity.RefundsHistory;
import com.example.skip.enumeration.RefundStatus;

@EntityView(RefundsHistory.class)
public interface RefundsHistoryView {
    @IdMapping
    Long getRefundId();

    RefundStatus getStatus();
}
