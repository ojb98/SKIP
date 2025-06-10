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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
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

            // 기존에 동일한 상품이 있는지 조회 (user, itemDetail, rentStart, rentEnd 모두 동일한 항목)
            Optional<CartItem> existingCartItemOpt = cartItemRepository.findByUserAndItemDetailAndRentStartAndRentEnd(
                    user, itemDetail, dto.getRentStart(), dto.getRentEnd()
            );

            if (existingCartItemOpt.isPresent()) {
                // 기존 항목이 있으면 수량 + dto.getQuantity() 하고 가격 갱신
                CartItem existingCartItem = existingCartItemOpt.get();
                int newQuantity = existingCartItem.getQuantity() + dto.getQuantity();
                existingCartItem.setQuantity(newQuantity);
                existingCartItem.setPrice(newQuantity * itemDetail.getPrice());

                cartItemRepository.save(existingCartItem);
            } else {
                // 없으면 새로 생성
                CartItem cartItem = new CartItem();
                cartItem.setUser(user);
                cartItem.setItemDetail(itemDetail);
                cartItem.setQuantity(dto.getQuantity());
                cartItem.setPrice(dto.getQuantity() * itemDetail.getPrice());
                cartItem.setRentStart(dto.getRentStart());
                cartItem.setRentEnd(dto.getRentEnd());

                cartItemRepository.save(cartItem);
            }
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
                .collect(Collectors.groupingBy(
                        cart-> cart.getItemDetail().getItem().getRent(),  // 그룹 기준: 렌탈샵(Rent)
                        LinkedHashMap::new,  //정렬 순서 유지
                        Collectors.toList()  // 같은 그룹은 List<CartItem>으로 묶음
                ))
                // Map<Rent, List<CartItem>> : Map은 스트림을 바로 지원하지 않기 때문에
                // .entrySet()으로 쌍(key-value) 목록을 꺼내고, 그걸 스트림으로 변환해서 유연하게 처리하기 위해서
                .entrySet().stream()
                .map(entry -> {
                    Rent rent = entry.getKey();  // 그룹의 기준이 된 렌탈샵
                    // entry.getValue()는 이 렌탈샵에 속한 List<CartItem>
                    List<CartItemDTO> itemDTO = entry.getValue().stream()
                            .map(ci -> CartItemDTO.builder()
                                    .cartId(ci.getCartId())
                                    .itemId(ci.getItemDetail().getItem().getItemId())
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

    // 장바구니 삭제
    public void deleteCartItems(List<Long> cartIds){
        cartItemRepository.deleteAllByCartIdIn(cartIds);
    }

    //장바구니 수량 변경(+가격)
    public void updateCartItemQuantity(Long cartId, int quantity){
        if (quantity < 1) {
            throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        }

        CartItem cartItem = cartItemRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템을 찾을 수 없습니다."));

        cartItem.setQuantity(quantity);

        // 단가 * 수량으로 가격 재계산
        int unitPrice = cartItem.getItemDetail().getPrice();
        cartItem.setPrice(unitPrice * quantity);

        cartItemRepository.save(cartItem);
    }

}
