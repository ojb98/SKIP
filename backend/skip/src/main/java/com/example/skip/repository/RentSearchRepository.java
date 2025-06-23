package com.example.skip.repository;

import com.example.skip.document.RentDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface RentSearchRepository extends ElasticsearchRepository<RentDocument, String> {

}
