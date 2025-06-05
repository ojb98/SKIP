package com.example.skip.repository;

import com.example.skip.entity.CartItem;
import com.example.skip.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {

    // user객체로 CartItem 리스트 조회
    List<CartItem> findByUser(User user);

    // cartIds에 포함된 ID들을 전부 삭제
    void deleteAllByCartIdIn(List<Long> cartIds);
}
