package com.example.skip.service;

import co.elastic.clients.elasticsearch._types.aggregations.AggregationBuilders;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.search.Highlight;
import co.elastic.clients.elasticsearch.core.search.HighlightField;
import com.example.skip.document.RentDocument;
import com.example.skip.entity.Rent;
import com.example.skip.repository.RentRepository;
import com.example.skip.repository.RentSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.HighlightQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentSearchService {
    private final ElasticsearchOperations elasticsearchOperations;

    private final RentSearchRepository rentSearchRepository;

    private final RentRepository rentRepository;


    public void saveOrUpdate(Rent rent) {
        rentSearchRepository.save(RentDocument.from(rent));
    }

    public void deleteById(String rentId) {
        rentSearchRepository.deleteById(rentId);
    }

    public void syncRecentlyUpdated() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);

        List<Rent> rents = rentRepository.findByUpdatedAtAfter(yesterday);

        rentSearchRepository.saveAll(rents.stream().map(RentDocument::from).toList());
    }

    public List<String> autocomplete(String keyword) {
        BoolQuery boolQuery = QueryBuilders.bool()
                .should(builder -> builder.match(m -> m.field("name").query(keyword).queryName("name")))
                .should(builder -> builder.match(m -> m.field("regionFullName").query(keyword).queryName("regionFullName")))
                .should(builder -> builder.match(m -> m.field("regionShortName").query(keyword).queryName("regionShortName")))
                .should(builder -> builder.match(m -> m.field("streetAddress").query(keyword).queryName("streetAddress")))
                .should(builder -> builder.match(m -> m.field("basicAddress").query(keyword).queryName("basicAddress")))
                .build();

        Query query = NativeQuery.builder()
                .withQuery(q -> q
                        .bool(boolQuery)
                )
                .withMaxResults(8)
                .build();

        SearchHits<RentDocument> searchHits = elasticsearchOperations.search(query, RentDocument.class);

        List<String> autocomplete = new ArrayList<>();

        for (SearchHit<RentDocument> searchHit : searchHits) {
            RentDocument rent = searchHit.getContent();
            for (String matched: searchHit.getMatchedQueries()) {
                String matchedValue = switch (matched) {
                    case "name" -> rent.getName();
                    case "streetAddress" -> rent.getStreetAddress();
                    case "basicAddress" -> rent.getBasicAddress();
                    case "regionShortName" -> rent.getRegionShortname();
                    case "regionFullName" -> rent.getRegionFullName();
                    default -> null;
                };

                if (matchedValue != null) {
                    autocomplete.add(matchedValue);
                }
            }
        }

        return autocomplete;
    }

    public List<Long> getIdsByKeyword(String keyword) {
        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(
                        QueryBuilders.multiMatch(
                                m -> m
                                        .query(keyword)
                                        .fields(List.of())
                                        .type(TextQueryType.BoolPrefix)
                                        .fuzziness("AUTO")
                                        .operator(Operator.Or)
                        )
                )
                .build();

        return elasticsearchOperations
                .search(nativeQuery, RentDocument.class)
                .stream()
                .map(hit -> Long.valueOf(hit.getContent().getRentId()))
                .toList();
    }
}
