package com.example.skip.service;

import com.example.skip.entity.Boost;
import com.example.skip.repository.BoostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class BoostService {
    @Autowired
    private BoostRepository boostRepository;

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