package com.example.skip.controller;

import com.example.skip.dto.cart.CartGroupDTO;
import com.example.skip.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carts")
public class CartController {

    private final CartItemService cartItemService;

    // 렌탈샵 기준으로 그룹핑해서 목록 뿌려주기
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartGroupDTO>> getCartByRent(@PathVariable Long userId){
        List<CartGroupDTO> cart = cartItemService.getGroupedCartItems(userId);
        return ResponseEntity.ok(cart);
    }
}
