package com.example.skip.controller;

import com.example.skip.dto.RankedRentDto;
import com.example.skip.dto.projection.ReviewStatsDTO;
import com.example.skip.dto.request.RankingRequest;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.service.RentStatService;
import com.example.skip.service.ReviewService;
import com.querydsl.core.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
public class RentStatController {

    private final RentStatService rentStatService;

    private final ReviewService reviewService;


    @GetMapping("/api/public/ranking")
    public ApiResponse getTopTenRanking(RankingRequest rankingRequest) throws InterruptedException, ExecutionException {
        // 현재 랭킹 조회 시작
        CompletableFuture<List<RankedRentDto>> currentFuture = rentStatService.getRankedList(rankingRequest)
                .thenApply(rankedRentDtos -> {
                            rankedRentDtos.stream().map(RankedRentDto::getRentId).toList()
                    );

                    // 현재 랭킹에 평점 저장
                    rankedRentDtos.forEach(
                            rankedRentDto -> {
                                Double rating = idToRating.get(rankedRentDto.getRentId());
                                rankedRentDto.setRating(rating == null ? 0.0 : rating);
                            }
                    );

                    return rankedRentDtos;
                });

        // 이전 랭킹 조회 시작
        CompletableFuture<List<RankedRentDto>> previousFuture = rentStatService.getRankedList(RankingRequest.builder()
                .region(rankingRequest.getRegion())
                .from(rankingRequest.getPreviousFrom())
                .to(rankingRequest.getPreviousTo())
                .build());

        List<RankedRentDto> previousRanking = previousFuture.get();

        // 이전 랭킹 id로 해싱
        Map<Long, Integer> idToRank = new HashMap<>();
        for (RankedRentDto rankedRentDto: previousRanking) {
            idToRank.put(rankedRentDto.getRentId(), rankedRentDto.getRank());
        }

        List<RankedRentDto> currentRanking = currentFuture.get();

        // 현재 랭킹에 이전 랭킹 저장
        for (RankedRentDto rankedRentDto: currentRanking) {
            rankedRentDto.setPreviousRank(idToRank.get(rankedRentDto.getRentId()));
        }

        return ApiResponse.builder()
                .success(true)
                .data(currentRanking)
                .build();
    }


}
