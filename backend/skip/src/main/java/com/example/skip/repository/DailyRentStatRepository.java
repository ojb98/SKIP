package com.example.skip.repository;

import com.example.skip.entity.DailyRentStat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyRentStatRepository extends JpaRepository<DailyRentStat, Long> {
}
