package com.example.skip.repository;


import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.User;
import com.example.skip.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishListRepository extends JpaRepository<WishList,Long> {
    // 찜 중복 확인
    boolean existsByUserAndItemDetail(User user, ItemDetail itemDetail);
}
