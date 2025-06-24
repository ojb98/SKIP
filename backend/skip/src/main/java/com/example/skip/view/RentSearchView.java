package com.example.skip.view;

import com.blazebit.persistence.view.EntityView;
import com.blazebit.persistence.view.IdMapping;
import com.example.skip.converter.RegionConverter;
import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.enumeration.*;
import jakarta.persistence.*;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;

@EntityView(Rent.class)
public interface RentSearchView {
    @IdMapping
    Long getRentId();

    RentCategory getCategory();

    String getName();

    String getPhone();

    String getStreetAddress();

    String getBasicAddress();

    String getThumbnail();

    String getImage1();

    String getImage2();

    String getImage3();

    String getDescription();

    String getBizRegNumber();
}
