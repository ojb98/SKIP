package com.example.skip.view;

import com.blazebit.persistence.SubqueryInitiator;
import com.blazebit.persistence.view.*;
import com.example.skip.entity.DailyRentStat;
import com.example.skip.entity.Rent;

@EntityView(Rent.class)
public interface RentPopularityView extends RentSearchView {
    @MappingSubquery(PopularitySubqueryProvider.class)
    Long getPopularity();

    class PopularitySubqueryProvider implements SubqueryProvider {
        @Override
        public <T> T createSubquery(SubqueryInitiator<T> subqueryInitiator) {
            return subqueryInitiator
                    .from(DailyRentStat.class, "drs")
                    .select("SUM(drs.reservationCount)")
                    .where("drs.rent.rentId").eqExpression("OUTER(rentId)")
                    .end();
        }
    }
}
