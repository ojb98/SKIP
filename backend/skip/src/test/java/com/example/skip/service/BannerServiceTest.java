package com.example.skip.service;

import com.example.skip.dto.rent.RentDTO;
import com.example.skip.entity.ActiveBannerList;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Rollback(value = false)
@Transactional
@SpringBootTest
public class BannerServiceTest {
    @Autowired
    private BannerService bannerService;

    @Autowired
    private RentService rentService;

    @Autowired
    private UserService userService;


    @Test
    public void insert() {
        RentDTO dto = rentService.getRent(1L);

        for (int i = 0; i < 10; i++) {
            bannerService.saveActiveBannerList(ActiveBannerList.builder()
                    .bannerImage("/img.jpeg")
                    .rent(dto.toEntity(userService.getUser(dto.getUserId()).toEntity()))
                    .clickCnt(0)
                    .finalScore(BigDecimal.valueOf(i))
                    .cpcBid(1000)
                    .build());
        }
    }
}
