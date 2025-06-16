package com.example.skip.dto.request;

import com.blazebit.persistence.CriteriaBuilder;
import com.example.skip.entity.QRefundsHistory;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Data
public class RefundSearchRequest {
    private LocalDate from;

    private LocalDate to;

    private RefundSortOption sort;


    public static enum RefundSortOption {
        LATEST("createdAt", false, QRefundsHistory.refundsHistory.createdAt.desc()),
        OLDEST("createdAt", true, QRefundsHistory.refundsHistory.createdAt.asc());

        private String sortField;

        private boolean ascending;

        private OrderSpecifier<LocalDateTime> orderSpecifier;


        RefundSortOption(String sortField, boolean ascending, OrderSpecifier<LocalDateTime> orderSpecifier) {
            this.sortField = sortField;
            this.ascending = ascending;
            this.orderSpecifier = orderSpecifier;
        }

        public void applyTo(CriteriaBuilder criteriaBuilder) {
            criteriaBuilder.orderBy(sortField, ascending);
        }

        public OrderSpecifier<?> getSpecifier() {
            return orderSpecifier;
        }

        public static RefundSortOption from(String value) {
            return Arrays.stream(values())
                    .filter(refundSortOption -> refundSortOption.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElse(LATEST);
        }
    }


    public BooleanExpression toPredicate(QRefundsHistory refundsHistory) {
        if (from != null && to != null) {
            return refundsHistory.createdAt.goe(from.atStartOfDay()).and(refundsHistory.createdAt.lt(to.plusDays(1).atStartOfDay()));
        }
        return null;
    }
}
