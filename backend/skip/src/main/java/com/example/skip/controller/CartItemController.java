package com.example.skip.controller;

import com.example.skip.dto.cart.CartAddDTO;
import com.example.skip.dto.cart.CartGroupDTO;
import com.example.skip.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carts")
public class CartItemController {

    private final CartItemService cartItemService;

    // userId기준으로 장바구니 추가
    @PostMapping("/{userId}")
    public ResponseEntity<String> addCartItem(@PathVariable("userId") Long userId,
                                              @RequestBody List<CartAddDTO> dto){
        cartItemService.addItemToCart(userId,dto);
        return ResponseEntity.ok("InsertCartSuccess");
    }

    // 렌탈샵 기준으로 그룹핑해서 목록 뿌려주기
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartGroupDTO>> getCartByRent(@PathVariable Long userId){
        List<CartGroupDTO> cart = cartItemService.getGroupedCartItems(userId);
        return ResponseEntity.ok(cart);
    }


}
