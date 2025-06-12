package com.example.skip.controller;

import com.example.skip.dto.response.ApiResponse;
import com.example.skip.service.SkiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/ski")
@RequiredArgsConstructor
public class SkiController {
    private final SkiService skiService;


    @GetMapping("/location")
    public ApiResponse skiListWithCoordinates() {
        try {
            return ApiResponse.builder()
                    .success(true)
                    .data(skiService.translateAddressToCoordinates(skiService.skiList())).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .data("스키장을 조회하지 못했습니다.")
                    .build();
        }
    }

    @GetMapping("/forecast")
    public ApiResponse getForecast(@RequestParam("lat") Double lat,
                                   @RequestParam("lon") Double lon) {

        try {
            return ApiResponse.builder()
                    .success(true)
                    .data(skiService.getForecast(lat, lon)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .data("날씨를 불러오지 못했습니다.")
                    .build();
        }
    }
}
