package com.example.skip.controller;

import com.example.skip.dto.ActiveBannerListDto;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/banner")
@RequiredArgsConstructor
public class BannerController {
    private final BannerService bannerService;


    // 홈페이지에서 보여줄 정렬된 배너
    @GetMapping("/list/order")
    public ApiResponse listOrderedBanner() {
        try {
            List<ActiveBannerListDto> list = bannerService.getActiveBannerListOrderedByFinalScore();

            return ApiResponse.builder()
                    .success(true)
                    .data(list)
                    .build();
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .data(e.getMessage()).build();
        }
    }
}
