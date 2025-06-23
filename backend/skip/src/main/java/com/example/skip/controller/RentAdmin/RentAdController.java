package com.example.skip.controller.RentAdmin;

import com.example.skip.dto.ad.AdCashChargeDTO;
import com.example.skip.dto.banner.BannerWaitingListDTO;
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
    public ResponseEntity<Map<String, String>> getCash(
            @RequestParam Long userId,
            @RequestParam(required = false) Long rentId) {
        String remaining = rentAdService.getCash(userId, rentId);
        return ResponseEntity.ok(Map.of("remainingCash", remaining));
    }

    @PostMapping("/cash")
    public ResponseEntity<Map<String, String>> chargeCash(@RequestBody AdCashChargeDTO dto) throws Exception {
        String remaining = rentAdService.chargeCash(dto);
        return ResponseEntity.ok(Map.of("remainingCash", remaining));
    }

    @GetMapping("/cash/decrypt")
    public ResponseEntity<Map<String, Integer>> decryptCash(@RequestParam String cashToken) {
        int amount = rentAdService.decryptCash(cashToken);
        return ResponseEntity.ok(Map.of("remainingCash", amount));
    }

    @PostMapping("/boost")
    public ResponseEntity<Map<String, String>> purchaseBoost(@RequestBody Map<String, Object> body) {
        Long userId = ((Number) body.get("userId")).longValue();
        Long rentId = body.get("rentId") != null ? ((Number) body.get("rentId")).longValue() : null;
        int boost = ((Number) body.get("boost")).intValue();
        int cpb = ((Number) body.get("cpb")).intValue();
        String token = (String) body.get("cashToken");
        String remaining = rentAdService.purchaseBoost(userId, rentId, boost, cpb, token);
        return ResponseEntity.ok(Map.of("remainingCash", remaining));
    }

    @GetMapping("/boost")
    public ResponseEntity<Map<String, Integer>> getActiveBoost(
            @RequestParam Long userId,
            @RequestParam(required = false) Long rentId
    ) {
        int count = rentAdService.getActiveBoost(userId, rentId);
        return ResponseEntity.ok(Map.of("activeBoost", count));
    }

    @GetMapping("/boost/cpb")
    public ResponseEntity<Map<String, Integer>> getCpb(
            @RequestParam Long userId,
            @RequestParam(required = false) Long rentId) {
        int cpb = rentAdService.getCpb(userId, rentId);
        return ResponseEntity.ok(Map.of("cpb", cpb));
    }


    @PostMapping(value = "/banner", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> submitBanner(
            @RequestParam Long userId,
            @RequestParam(required = false) Long rentId,
            @RequestParam Integer cpcBid,
            @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage,
            @RequestParam String cashToken
    ) {
        String remaining = rentAdService.submitBanner(userId, rentId, cpcBid, bannerImage, cashToken);
        Map<String, String> response = Map.of("remainingCash", remaining);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/banner/{waitingId}")
    public ResponseEntity<BannerWaitingListDTO> getBanner(
            @RequestParam Long userId,
            @PathVariable Long waitingId
    ) {
        BannerWaitingListDTO dto = rentAdService.getBanner(userId, waitingId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/banner/withdrawn")
    public ResponseEntity<BannerWaitingListDTO> getWithdrawnBanner(@RequestParam Long userId) {
        BannerWaitingListDTO dto = rentAdService.getLatestWithdrawnBanner(userId);
        if (dto == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping(value = "/banner/{waitingId}", consumes = "multipart/form-data")
    public ResponseEntity<BannerWaitingListDTO> resubmitBanner(
            @RequestParam Long userId,
            @PathVariable Long waitingId,
            @RequestParam Integer cpcBid,
            @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage
    ) {
        BannerWaitingListDTO dto = rentAdService.resubmitBanner(userId, waitingId, cpcBid, bannerImage);
        return ResponseEntity.ok(dto);
    }
}