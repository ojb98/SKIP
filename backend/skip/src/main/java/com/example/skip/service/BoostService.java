package com.example.skip.service;

import com.example.skip.entity.Boost;
import com.example.skip.repository.BoostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BoostService {
    @Autowired
    private BoostRepository boostRepository;

    public BoostService(BoostRepository boostRepository) {
        this.boostRepository = boostRepository;
    }

    @Scheduled(cron = "0 0 0 * * MON") // 매주 월요일 자정 실행
    public void expireBoosts() {
        List<Boost> expiredBoosts = boostRepository.findByEndDateBefore(LocalDate.now().atStartOfDay());
        for (Boost boost : expiredBoosts) {
            boost.setBoost(0); // 예: 효과 제거
            boost.setUpdateDate(LocalDate.now().atStartOfDay());
        }
        boostRepository.saveAll(expiredBoosts);
    }

    public Boost addBoost(Long rentId, Integer boost, Integer cpb, LocalDateTime endDate) {
        Boost newBoost = Boost.builder()
                .rentId(rentId)
                .boost(boost)
                .cpb(cpb)
                .endDate(endDate)
                .build();
        return boostRepository.save(newBoost);
    }

    public Boost updateBoost(Long boostId, Integer boost, Integer cpb) {
        Optional<Boost> optionalBoost = boostRepository.findById(boostId);
        if (optionalBoost.isPresent()) {
            Boost existingBoost = optionalBoost.get();
            existingBoost.setBoost(boost);
            existingBoost.setCpb(cpb);
            return boostRepository.save(existingBoost);
        }
        return null;
    }
}