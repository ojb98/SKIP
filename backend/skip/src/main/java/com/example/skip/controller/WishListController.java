package com.example.skip.controller;

import com.example.skip.dto.WishAddDTO;
import com.example.skip.service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishes")
public class WishListController {

    private final WishListService wishListService;

    @PostMapping
    public ResponseEntity<String> addToWishList(@RequestBody WishAddDTO dto) {
        wishListService.addWish(dto);
        return ResponseEntity.ok("AddWishSuccess");
    }
}
