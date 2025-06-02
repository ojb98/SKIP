package com.example.skip.service;

import com.example.skip.dto.cart.CartAddDTO;
import com.example.skip.dto.cart.CartGroupDTO;
import com.example.skip.dto.cart.CartItemDTO;
import com.example.skip.entity.CartItem;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.repository.CartItemRepository;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ItemDetailRepository itemDetailRepository;
    private final UserRepository userRepository;

    //장바구니 추가
    public void addItemToCart(Long userId, List<CartAddDTO> cartAddDTO){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("사용자를 찾을수없습니다."));

        for(CartAddDTO dto: cartAddDTO){
            ItemDetail itemDetail = itemDetailRepository.findById(dto.getItemDetailId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 상세 정보를 찾을 수 없습니다."));

            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setItemDetail(itemDetail);
            cartItem.setQuantity(dto.getQuantity());
            cartItem.setPrice(itemDetail.getPrice());
            cartItem.setRentStart(dto.getRentStart());
            cartItem.setRentEnd(dto.getRentEnd());

            cartItemRepository.save(cartItem);
        }
    }

    //장바구니 목록 보여주기
    public List<CartGroupDTO> getGroupedCartItems(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("사용자를 찾을수없습니다."));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        // 렌탈샵 기준 그룹화
        return cartItems.stream()
                .sorted(Comparator.comparing(CartItem::getCreatedAt).reversed())  //내림차순 정렬
                .collect(Collectors.groupingBy(cart->
                        cart.getItemDetail().getItem().getRent(), LinkedHashMap::new, Collectors.toList()))  //순서유지
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
                                    .rentStart(ci.getRentStart().toString()) // LocalDateTime -> String 변환
                                    .rentEnd(ci.getRentEnd().toString())
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
