package com.example.skip.service;

import com.example.skip.dto.WishAddDTO;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.User;
import com.example.skip.entity.WishList;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.repository.WishListRepository;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class WishListService {

    private final WishListRepository wishListRepository;
    private final UserRepository userRepository;
    private final ItemDetailRepository itemDetailRepository;

    //찜 추가
    public void addWish(WishAddDTO dto){
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        ItemDetail itemDetail = itemDetailRepository.findById(dto.getItemDetailId())
                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));

        // 이미 찜한 항목인지 확인
        if (wishListRepository.existsByUserAndItemDetail(user, itemDetail)) {
            throw new IllegalStateException("이미 찜한 상품입니다.");
        }

        WishList wish = new WishList();
        wish.setUser(user);
        wish.setItemDetail(itemDetail);
        wishListRepository.save(wish);
    }

}
