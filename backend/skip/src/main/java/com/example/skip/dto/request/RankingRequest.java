package com.example.skip.dto.request;

import com.example.skip.entity.QDailyRentStat;
import com.example.skip.enumeration.Region;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RankingRequest {
    private Region region;

    private LocalDate from;

    private LocalDate to;


    public BooleanExpression toPredicate(QDailyRentStat dailyRentStat) {
        return Expressions.allOf(
                region != null && region != Region.ETC ? dailyRentStat.region.eq(region) : null,
                from != null && to != null ? dailyRentStat.statDate.between(from, to) : null
        );
    }

    public LocalDate getPreviousFrom() {
        if (from != null && to != null) {
            return from.minusDays(ChronoUnit.DAYS.between(from, to) + 1);
        }

        return null;
    }

    public LocalDate getPreviousTo() {
        if (from != null) {
            return from.minusDays(1);
        }

        return null;
    }
}
