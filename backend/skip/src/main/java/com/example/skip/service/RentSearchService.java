package com.example.skip.service;

import co.elastic.clients.elasticsearch._types.aggregations.AggregationBuilders;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MatchBoolPrefixQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch.core.search.Highlight;
import co.elastic.clients.elasticsearch.core.search.HighlightField;
import com.example.skip.document.RentDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.HighlightQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentSearchService {
    private final ElasticsearchOperations elasticsearchOperations;


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
}
