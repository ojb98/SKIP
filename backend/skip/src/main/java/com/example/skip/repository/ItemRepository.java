package com.example.skip.repository;

import com.example.skip.entity.Item;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.YesNo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Long> {

    //장비 전체 조회(렌탈샵 기준 + 사용여부(isActive = Y) + 등록일 내림차순)
    List<Item> findByRent_RentIdAndIsActive(Long rentRentId, YesNo isActive, Sort sort);

}
