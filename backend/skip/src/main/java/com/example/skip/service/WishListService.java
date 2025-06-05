package com.example.skip.service;

import com.example.skip.dto.WishAddDTO;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.User;
import com.example.skip.entity.WishList;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.repository.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

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

        // 찜 개수 제한
        long wishCount = wishListRepository.countByUser(user);
        if (wishCount >= 30) {
            throw new IllegalStateException("찜은 최대 30개까지만 가능합니다.");
        }

        WishList wish = new WishList();
        wish.setUser(user);
        wish.setItemDetail(itemDetail);
        wishListRepository.save(wish);
    }

    //찜 목록 보여주기
//    public List<WishListDTO> getWishList(Long userId){
//        User user = userRepository.findByUserId(userId)
//                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
//
//        // 등록일 기준 내림차순 정렬
//        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
//        return wishListRepository.findAllByUser(user,sort);
//    }
}
