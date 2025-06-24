package com.example.skip.repository;

import com.example.skip.dto.RentSearchCondition;
import com.example.skip.enumeration.RentSearchSortOption;
import com.example.skip.view.RentPopularityView;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class RentRepositoryTest {
    @Autowired
    private RentCustomRepository rentCustomRepository;


    @Test
    public void searchTest() {
        System.out.println(rentCustomRepository.searchWithKey(
                RentSearchCondition.builder()
                        .rentIds(List.of(1L, 2L, 4L, 6L, 7L))
                        .rentSearchSortOption(RentSearchSortOption.POPULAR)
                        .build(),
                RentPopularityView.class
        ));
    }
}
