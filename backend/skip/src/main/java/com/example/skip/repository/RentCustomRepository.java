package com.example.skip.repository;

import com.blazebit.persistence.*;
import com.blazebit.persistence.spring.data.repository.KeysetPageRequest;
import com.blazebit.persistence.view.EntityViewManager;
import com.blazebit.persistence.view.EntityViewSetting;
import com.blazebit.persistence.view.Sorters;
import com.example.skip.dto.CustomKeysetPage;
import com.example.skip.dto.RentSearchCondition;
import com.example.skip.dto.response.RentSearchResponse;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.RentSearchSortOption;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Repository
@RequiredArgsConstructor
public class RentCustomRepository {
    private final CriteriaBuilderFactory criteriaBuilderFactory;

    private final EntityManager entityManager;

    private final EntityViewManager entityViewManager;


    public <T> RentSearchResponse<T> searchWithKey(RentSearchCondition rentSearchCondition, Class<T> viewClass) {
        CriteriaBuilder<Rent> criteriaBuilder = criteriaBuilderFactory.create(entityManager, Rent.class);

        criteriaBuilder
                .where("rentId").in(rentSearchCondition.getRentIds());

        LocalDateTime from = rentSearchCondition.getFrom();
        LocalDateTime to = rentSearchCondition.getTo();
        List<ItemCategory> itemCategories = rentSearchCondition.getItemCategories();

        log.info("{}", rentSearchCondition);

        if (from != null && to != null && itemCategories != null && !itemCategories.isEmpty()) {
            for (int i = 0; i < itemCategories.size(); i++) {
                ItemCategory itemCategory = itemCategories.get(i);
                String param = "category" + i;

                criteriaBuilder
                        .where(
                                "EXISTS (" +
                                        "SELECT 1 FROM ItemDetail idt " +
                                        "JOIN idt.item i " +
                                        "JOIN i.rent r2 " +
                                        "WHERE r2.rentId = r.rentId " +
                                        "AND i.category = :" + param + " " +
                                        "AND idt.stockQuantity > (" +
                                        "SELECT COALESCE(SUM(ri.quantity), 0) " +
                                        "FROM ReservationItem ri " +
                                        "WHERE ri.idt = idt " +
                                        "AND ri.rentStart < :to AND ri.rentEnd > :from" +
                                        ")" +
                                        ")"
                        );


                criteriaBuilder.setParameter(param, itemCategory);
            }
            criteriaBuilder.setParameter("to", to);
            criteriaBuilder.setParameter("from", from);
        }

        EntityViewSetting<T, PaginatedCriteriaBuilder<T>> entityViewSetting = EntityViewSetting.create(
                viewClass,
                rentSearchCondition.getPageable().first(),
                rentSearchCondition.getPageable().getPageSize()
        );
        applySort(entityViewSetting, rentSearchCondition.getRentSearchSortOption());

        PagedList<T> result = entityViewManager.applySetting(
                entityViewSetting,
                criteriaBuilder
        ).getResultList();

        return new RentSearchResponse<>(
                result,
                result.getPage(),
                result.getPage() < result.getTotalPages()
        );
    }

    private <T> void applySort(EntityViewSetting<T, ?> entityViewSetting, RentSearchSortOption rentSearchSortOption) {
        switch (rentSearchSortOption) {
            case DEFAULT -> {
                entityViewSetting.addAttributeSorter("totalBoosts", Sorters.descending());
                entityViewSetting.addAttributeSorter("rentId", Sorters.descending());
            }
            case POPULAR -> {
                entityViewSetting.addAttributeSorter("popularity", Sorters.descending());
                entityViewSetting.addAttributeSorter("rentId", Sorters.descending());
            }
            case RATING -> {
                entityViewSetting.addAttributeSorter("averageRating", Sorters.descending());
                entityViewSetting.addAttributeSorter("rentId", Sorters.descending());
            }

        }
    }
}
