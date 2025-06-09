package com.example.skip.controller;

import com.example.skip.dto.WishAddDTO;
import com.example.skip.dto.WishListDTO;
import com.example.skip.service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{userId}")
    public ResponseEntity<List<WishListDTO>> getWishList(@PathVariable("userId") Long userId){
        List<WishListDTO> list = (List<WishListDTO>) wishListService.getWishList(userId);
        return ResponseEntity.ok(list);

    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String> removeWishList(@PathVariable("wishlistId") Long wishlistId){
        wishListService.removeWishList(wishlistId);
        return ResponseEntity.ok("DeleteWishSuccess");
    }

}
