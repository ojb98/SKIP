package com.example.skip.controller.admin;

import com.example.skip.dto.banner.BannerActiveListDTO;
import com.example.skip.dto.banner.BannerWaitingListDTO;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.entity.BannerActiveList;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/waiting")
    public ResponseEntity<List<BannerWaitingListDTO>> getWaitingBanners() {
        List<BannerWaitingListDTO> banners = bannerService.getWaitingBanners();
        return ResponseEntity.ok(banners);
    }
    @GetMapping("/waiting/approved")
    public ResponseEntity<List<BannerWaitingListDTO>> getApprovedWaitingBanners() {
        List<BannerWaitingListDTO> banners = bannerService.getApprovedWaitingBanners();
        return ResponseEntity.ok(banners);
    }


    @GetMapping("/active")
    public ResponseEntity<List<BannerActiveListDTO>> getActiveBanners() {
        List<BannerActiveListDTO> banners = bannerService.getActiveBanners();
        return ResponseEntity.ok(banners);
    }

    // 정렬된 활성화 리스트
    @GetMapping("/list/order")
    public ApiResponse listOrderedBanner() {
        try {
            List<BannerActiveListDTO> list = bannerService.getActiveBannerListOrderedByFinalScore();

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

    // 배너 클릭
    @PatchMapping("/{bannerId}/click")
    public ApiResponse click(@PathVariable("bannerId") Long bannerId) {
        log.info("Click!");
        try {
            bannerService.clickBanner(bannerId);
            return ApiResponse.builder()
                    .success(true)
                    .build();
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .build();
        }
    }

    @PutMapping("/waiting/{waitingId}/approve")
    public ResponseEntity<Void> approveBanner(@PathVariable Long waitingId) {
        bannerService.approveBanner(waitingId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/waiting/{waitingId}/reject")
    public ResponseEntity<Void> rejectBanner(@PathVariable Long waitingId,
                                             @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "");
        bannerService.rejectBanner(waitingId, reason);
        return ResponseEntity.ok().build();
    }
}