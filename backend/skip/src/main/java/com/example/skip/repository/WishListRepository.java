package com.example.skip.repository;


import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.User;
import com.example.skip.entity.WishList;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepository extends JpaRepository<WishList,Long> {

    // 찜 중복 확인
    boolean existsByUserAndItemDetail(User user, ItemDetail itemDetail);
    // 찜 개수 세기
    long countByUser(User user);

    //사용자 기준 찜목록 불러오기
    //List<WishListDTO> findAllByUser(User user, Sort sort);
}
