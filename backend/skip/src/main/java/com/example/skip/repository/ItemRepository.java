package com.example.skip.repository;

import com.example.skip.entity.Item;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.YesNo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item,Long> {

    //ItemDetail엔티티를 기준으로 ItemDetail에 소속되어 사용중인 장비(중복제거) 보여줌
    @Query("SELECT DISTINCT d.item FROM ItemDetail d WHERE d.isActive = 'Y' AND d.item.rent.rentId = :rentId")
    List<Item> findActiveItemsByRentId(@Param("rentId") Long rentId);

    Optional<Item> findByRent_RentIdAndItemId(Long rentId, Long itemId);

}
