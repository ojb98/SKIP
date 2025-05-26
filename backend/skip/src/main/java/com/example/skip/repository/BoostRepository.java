package com.example.skip.repository;

import com.example.skip.entity.Boost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BoostRepository extends JpaRepository<Boost,Long> {

    List<Boost> findAllByEndDateBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    List<Boost> findByEndDateBefore(LocalDateTime endDateBefore);
}
