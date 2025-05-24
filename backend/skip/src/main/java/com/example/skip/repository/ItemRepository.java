package com.example.skip.repository;

import com.example.skip.entity.Item;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.YesNo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Long> {

}
