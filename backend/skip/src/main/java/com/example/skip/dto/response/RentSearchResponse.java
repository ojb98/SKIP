package com.example.skip.dto.response;

import com.blazebit.persistence.KeysetPage;
import com.blazebit.persistence.PagedList;
import com.blazebit.persistence.spring.data.repository.KeysetPageRequest;
import com.example.skip.dto.CustomKeysetPage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentSearchResponse <T> {
    private PagedList<T> result;

    private int page;

    private boolean hasNext;
}
