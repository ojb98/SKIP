package com.example.skip.view;

import com.blazebit.persistence.SubqueryInitiator;
import com.blazebit.persistence.view.*;
import com.example.skip.entity.Rent;
import com.example.skip.entity.Review;

@EntityView(Rent.class)
public interface RentRatingView extends RentSearchView {
    @MappingSubquery(AverageRatingSubqueryProvider.class)
    Double getAverageRating();


    class AverageRatingSubqueryProvider implements SubqueryProvider {
        @Override
        public <T> T createSubquery(SubqueryInitiator<T> subqueryInitiator) {
            return subqueryInitiator
                    .from(Review.class, "rv")
                    .select("AVG(rv.rating)")
                    .where("rv.reservationItem.reservation.rent.rentId").eqExpression("OUTER(rentId)")
                    .end();
        }
    }
}
