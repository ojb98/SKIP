package com.example.skip.controller.admin;

import com.example.skip.dto.banner.BannerActiveListDTO;
import com.example.skip.dto.banner.BannerWaitingListDTO;
import com.example.skip.entity.BannerActiveList;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/active")
    public ResponseEntity<List<BannerActiveListDTO>> getActiveBanners() {
        List<BannerActiveListDTO> banners = bannerService.getActiveBanners();
        return ResponseEntity.ok(banners);
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