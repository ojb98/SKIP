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

    @Query("SELECT DISTINCT d.item FROM ItemDetail d WHERE d.isActive = 'Y' AND d.item.rent.rentId = :rentId")
    List<Item> findActiveItemsByRentId(@Param("rentId") Long rentId);


    Optional<Item> findByRent_RentIdAndItemId(Long rentId, Long itemId);

}
