package com.example.skip.controller.RentAdmin;

import com.example.skip.dto.ad.AdCashChargeDTO;
import com.example.skip.service.RentAdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/rentAdmin")
@RequiredArgsConstructor
public class RentAdController {

    private final RentAdService rentAdService;

    @GetMapping("/cash")
    public ResponseEntity<Map<String, Integer>> getCash(@RequestParam Long userId) {
        int remaining = rentAdService.getCash(userId);
        return ResponseEntity.ok(Map.of("remainingCash", remaining));
    }

    @PostMapping("/cash")
    public ResponseEntity<Map<String, Integer>> chargeCash(@RequestBody AdCashChargeDTO dto) throws Exception {
        int remaining = rentAdService.chargeCash(dto);
        return ResponseEntity.ok(Map.of("remainingCash", remaining));
    }

    @PostMapping("/boost")
    public ResponseEntity<Map<String, Integer>> purchaseBoost(@RequestBody Map<String, Object> body) {
        Long userId = ((Number) body.get("userId")).longValue();
        int boost = ((Number) body.get("boost")).intValue();
        int cpb = ((Number) body.get("cpb")).intValue();
        int remaining = rentAdService.purchaseBoost(userId, boost, cpb);
        return ResponseEntity.ok(Map.of("remainingCash", remaining));
    }

    @PostMapping(value = "/banner", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Integer>> submitBanner(
            @RequestParam Long userId,
            @RequestParam Integer cpcBid,
            @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage
    ) {
        int remaining = rentAdService.submitBanner(userId, cpcBid, bannerImage);
        return ResponseEntity.ok(Map.of("remainingCash", remaining));
    }
}