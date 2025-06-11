package com.example.skip.repository;

import com.example.skip.entity.CartItem;
import com.example.skip.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {

    // user객체로 CartItem 리스트 조회
    List<CartItem> findByUser(User user);

    // cartIds에 포함된 ID들을 전부 삭제
    void deleteAllByCartIdIn(List<Long> cartIds);

    // 기본적으로 JPA의 메서드들은 select 조회용으로 생각해서 실행하는데, 삭제하거나 업데이트할 때는 별도로 표시
    @Modifying   // 데이터베이스에서 데이터를 수정(변경)하는 작업을 한다 알려주는 애노테이션
    @Transactional // 작업을 트랜잭션 단위로 처리해서 안정성 보장
    int deleteByCreatedAtBefore(LocalDateTime date);  // createdAt이 7일 전보다 이전인 항목 삭제


}
