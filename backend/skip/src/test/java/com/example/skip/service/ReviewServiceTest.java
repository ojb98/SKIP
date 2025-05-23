package com.example.skip.service;

import com.example.skip.dto.ReviewDTO;
import com.example.skip.dto.ReviewRequestDTO;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import java.nio.file.AccessDeniedException;

@SpringBootTest
@Transactional
@Commit
public class ReviewServiceTest {
    @Autowired
    private ReviewService reviewService;

    @Test
    public void write() throws AccessDeniedException {
        ReviewRequestDTO dto = new ReviewRequestDTO();
        dto.setReserveId(1L);
        dto.setRating(5);
        dto.setContent("테스트 리뷰 작성");
        dto.setImageFile(null);

        ReviewDTO rDto =  reviewService.writeReview(dto, 1L);

        System.out.println("<< 작성 리뷰 >>");
        System.out.println(rDto);

        Assertions.assertEquals(1L, rDto.getReserveId());
    }
}
