package com.example.skip.service;

import com.example.skip.dto.cart.CartGroupDTO;
import com.example.skip.dto.cart.CartItemDTO;
import com.example.skip.entity.CartItem;
import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.repository.CartItemRepository;
import com.example.skip.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public List<CartGroupDTO> getGroupedCartItems(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("사용자를 찾을수없습니다."));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        // 렌탈샵 기준 그룹화
        return cartItems.stream().collect(Collectors.groupingBy(cart->cart.getItemDetail().getItem().getRent()))
                .entrySet().stream()
                .map(entry -> {
                    Rent rent = entry.getKey();
                    List<CartItemDTO> itemDTO = entry.getValue().stream()
                            .map(ci -> CartItemDTO.builder()
                                    .cartId(ci.getCartId())
                                    .itemName(ci.getItemDetail().getItem().getName())
                                    .image(ci.getItemDetail().getItem().getImage())
                                    .size((ci.getItemDetail().getSize()))
                                    .quantity(ci.getQuantity())
                                    .price(ci.getPrice())
                                    .build())
                            .toList();

                    return CartGroupDTO.builder()
                            .rentId(rent.getRentId())
                            .name(rent.getName())
                            .items(itemDTO)
                            .build();
                }).toList();
    }

}
