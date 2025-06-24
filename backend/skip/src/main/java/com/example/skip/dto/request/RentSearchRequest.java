package com.example.skip.dto.request;

import com.blazebit.persistence.KeysetPage;
import com.blazebit.persistence.spring.data.repository.KeysetPageRequest;
import com.example.skip.dto.CustomKeysetPage;
import com.example.skip.dto.RentSearchCondition;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.RentSearchSortOption;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

@Data
public class RentSearchRequest {
    private String keyword;

    private LocalDate from;

    private LocalDate to;

    private List<ItemCategory> categories;

    private RentSearchSortOption sort;

    private String keyJson;


    public RentSearchCondition toCondition(List<Long> rentIds, Pageable pageable) {
        return RentSearchCondition.builder()
                .rentIds(rentIds)
                .from(from == null ? null : from.atStartOfDay())
                .to(to == null ? null : to.plusDays(1).atStartOfDay())
                .itemCategories(categories)
                .rentSearchSortOption(sort)
                .pageable(pageable)
                .build();
    }
}
