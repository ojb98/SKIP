package com.example.skip.repository;

import com.example.skip.document.RentDocument;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class RentSearchRepositoryTest {
    @Autowired
    private RentSearchRepository rentSearchRepository;


    @Test
    public void saveAll() {
        List<RentDocument> docs = List.of(
                new RentDocument("1", "서울렌탈샵", "서울특별시", "서울", "서울 특별시 종로구 땡땡로", "서울 특별시 종로구 땡땡동 땡번지"),
                new RentDocument("2", "광주렌탈샵", "경기도", "경북", "강원도 원자로", "강원도 원자동"),
                new RentDocument("3", "대충스키장", "충청남도", "충북", "청주", "청주")
        );

        rentSearchRepository.saveAll(docs);
    }
}
