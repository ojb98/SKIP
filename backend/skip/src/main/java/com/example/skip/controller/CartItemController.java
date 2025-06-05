package com.example.skip.controller;

import com.example.skip.dto.cart.CartAddDTO;
import com.example.skip.dto.cart.CartGroupDTO;
import com.example.skip.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    // 장바구니 삭제(단건, 다건)
    @DeleteMapping
    public ResponseEntity<String> removeCartItem(@RequestBody Map<String, List<Long>> body){
        List<Long> cartIds = body.get("cartIds");
        cartItemService.deleteCartItems(cartIds);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{cartId}")
    public ResponseEntity<?> updateQuantity(@PathVariable("cartId") Long cartId,
                                             @RequestBody Map<String, Integer> body){

        int quantity = body.getOrDefault("quantity", 1);  // 수량 없으면 기본 1
        cartItemService.updateCartItemQuantity(cartId, quantity);

        return ResponseEntity.ok().build();

    }

}
