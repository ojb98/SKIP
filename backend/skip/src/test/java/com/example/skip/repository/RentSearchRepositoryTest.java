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

    @Autowired
    private RentRepository rentRepository;


    @Test
    public void saveAll() {
        rentSearchRepository.saveAll(rentRepository.findAll().stream().map(RentDocument::from).toList());
    }
}
