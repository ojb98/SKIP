package com.example.skip.repository;

import com.example.skip.entity.Item;
import com.example.skip.entity.ItemDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemDetailRepository extends JpaRepository<ItemDetail,Long> {

}
