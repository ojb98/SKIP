package com.example.skip.handler;

import com.example.skip.config.SpringContextHolder;
import com.example.skip.entity.Rent;
import com.example.skip.repository.RentSearchRepository;
import com.example.skip.service.RentSearchService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

public class RentChangeListener {
    private RentSearchService getRentSearchService() {
        return SpringContextHolder.getBean(RentSearchService.class);
    }


    @PostPersist
    @PostUpdate
    public void onSaveOrUpdate(Rent rent) {
        getRentSearchService().saveOrUpdate(rent);
    }

    @PostRemove
    public void onDelete(Rent rent) {
        getRentSearchService().deleteById(rent.getRentId().toString());
    }
}
