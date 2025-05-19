package com.example.skip.repository;

import com.example.skip.entity.Boost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoostRepository extends JpaRepository<Boost,Long> {

}
