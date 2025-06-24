package com.example.skip.dto;

import com.blazebit.persistence.KeysetPage;
import com.blazebit.persistence.spring.data.repository.KeysetPageRequest;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.RentSearchSortOption;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RentSearchCondition {
    private List<Long> rentIds;

    private LocalDateTime from;

    private LocalDateTime to;

    private List<ItemCategory> itemCategories;

    private RentSearchSortOption rentSearchSortOption;

    private Pageable pageable;
}