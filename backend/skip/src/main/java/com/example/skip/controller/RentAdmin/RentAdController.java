package com.example.skip.controller.RentAdmin;

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

    @GetMapping("/mileage")
    public ResponseEntity<Map<String, Integer>> getMileage(@RequestParam Long userId) {
        int remaining = rentAdService.getMileage(userId);
        return ResponseEntity.ok(Map.of("remainingMileage", remaining));
    }

    @PostMapping("/mileage")
    public ResponseEntity<Map<String, Integer>> addMileage(@RequestBody Map<String, Object> body) {
        Long userId = ((Number) body.get("userId")).longValue();
        int amount = ((Number) body.get("amount")).intValue();
        int remaining = rentAdService.addMileage(userId, amount);
        return ResponseEntity.ok(Map.of("remainingMileage", remaining));
    }

    @PostMapping(value = "/banner", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Integer>> submitBanner(
            @RequestParam Long userId,
            @RequestParam Integer cpcBid,
            @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage
    ) {
        int remaining = rentAdService.submitBanner(userId, cpcBid, bannerImage);
        return ResponseEntity.ok(Map.of("remainingMileage", remaining));
    }
}