package com.example.skip.repository;

import com.example.skip.entity.Item;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item,Long> {

    // ItemDetail엔티티를 기준으로 ItemDetail에 소속되어 사용중인 장비(중복제거) 보여줌
    // 활성 상태인 상세가 1개 이상 있는 장비(Item)를 찾는 것
    @Query("SELECT DISTINCT d.item FROM ItemDetail d WHERE d.isActive = 'Y' AND d.item.rent.rentId = :rentId")
    List<Item> findActiveItemsByRentId(@Param("rentId") Long rentId);

    // rentId, itemId가 모두 일치하는 장비 찾기
    Optional<Item> findByRent_RentIdAndItemId(Long rentId, Long itemId);

    // 렌탈샵 상세 페이지 아이템 페이징
    @Query("""
        SELECT DISTINCT i
        FROM Item i
        JOIN i.itemDetails d
        WHERE i.rent.rentId =:rentId
            AND i.category =:category 
            AND d.isActive = 'Y'
    """)
    Page<Item> rentItemPaging(@Param("rentId") Long rentId,
                              @Param("category") ItemCategory category,
                              Pageable pageable);
}

