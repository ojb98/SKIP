package com.example.skip.config;

import com.blazebit.persistence.Criteria;
import com.blazebit.persistence.CriteriaBuilderFactory;
import com.blazebit.persistence.integration.view.spring.EnableEntityViews;
import com.blazebit.persistence.view.EntityViewManager;
import com.blazebit.persistence.view.EntityViews;
import com.blazebit.persistence.view.spi.EntityViewConfiguration;
import com.example.skip.views.ReservationDetailsWithItemsView;
import com.example.skip.views.ReservationItemDetailsView;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceUnit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BlazeConfig {
    @PersistenceUnit
    private EntityManagerFactory emf;

    @Bean
    public CriteriaBuilderFactory criteriaBuilderFactory() {
        return Criteria.getDefault().createCriteriaBuilderFactory(emf);
    }

    @Bean
    public EntityViewManager entityViewManager(CriteriaBuilderFactory cbf) {
        EntityViewConfiguration cfg = EntityViews.createDefaultConfiguration();
        cfg.addEntityView(ReservationDetailsWithItemsView.class);
        cfg.addEntityView(ReservationItemDetailsView.class);
        return cfg.createEntityViewManager(cbf);
    }
}
