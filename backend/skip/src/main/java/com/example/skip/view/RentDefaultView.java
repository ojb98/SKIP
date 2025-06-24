package com.example.skip.view;

import com.blazebit.persistence.SubqueryInitiator;
import com.blazebit.persistence.view.EntityView;
import com.blazebit.persistence.view.MappingSubquery;
import com.blazebit.persistence.view.SubqueryProvider;
import com.example.skip.entity.Boost;
import com.example.skip.entity.Rent;

@EntityView(Rent.class)
public interface RentDefaultView extends RentSearchView {
    @MappingSubquery(TotalBoostsSubqueryProvider.class)
    Long getTotalBoosts();

    class TotalBoostsSubqueryProvider implements SubqueryProvider {
        @Override
        public <T> T createSubquery(SubqueryInitiator<T> subqueryInitiator) {
            return subqueryInitiator
                    .from(Boost.class, "b")
                    .select("SUM(b.boost)")
                    .where("b.rentId").eqExpression("OUTER(rentId)")
                    .end();
        }
    }
}
