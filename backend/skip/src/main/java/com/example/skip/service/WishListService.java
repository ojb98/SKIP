package com.example.skip.service;

import com.example.skip.dto.WishAddDTO;
import com.example.skip.dto.WishListDTO;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.User;
import com.example.skip.entity.WishList;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

        // 이미 찜한 항목인지 확인 (Y/N 포함 모두 검사)
        Optional<WishList> existedWish = wishListRepository.findByUserAndItemDetail(user, itemDetail);
        if (existedWish.isPresent()) {
            WishList wish = existedWish.get();
            if (wish.getUseYn() == YesNo.Y) {
                throw new IllegalStateException("이미 찜한 상품입니다.");
            }
            // 상태만 복구
            wish.setUseYn(YesNo.Y);
            wishListRepository.save(wish);
            return;
        }

        // 찜 개수 제한 (Y 상태만 카운트)
        long wishCount = wishListRepository.countByUserAndUseYn(user, YesNo.Y);
        if (wishCount >= 30) {
            throw new IllegalStateException("찜은 최대 30개까지만 가능합니다.");
        }

        WishList wish = new WishList();
        wish.setUser(user);
        wish.setItemDetail(itemDetail);
        wish.setUseYn(YesNo.Y);
        wishListRepository.save(wish);
    }

    //찜 목록 보여주기
    public List<WishListDTO> getWishList(Long userId){
        // 사용자 확인
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        // 찜 목록 조회 (최신순)
        List<WishList> wishList = wishListRepository.findByUserAndUseYnOrderByCreatedAtDesc(user,YesNo.Y);

        // DTO 변환
        return wishList.stream().map(wish -> WishListDTO.from(wish)).toList();

    }

    //찜 삭제처리(useYn = N 으로 변경)
    public void removeWishList(Long wishlistId, String useYn){
        WishList wish = wishListRepository.findById(wishlistId)
                .orElseThrow(() -> new IllegalArgumentException("찜 항목이 존재하지 않습니다."));

        wish.setUseYn(YesNo.valueOf(useYn));    // enum으로 변환해서 저장
        wishListRepository.save(wish);
    }


}