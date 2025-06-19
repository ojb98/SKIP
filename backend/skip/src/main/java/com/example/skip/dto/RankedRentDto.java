package com.example.skip.dto;

import com.example.skip.entity.Rent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RankedRentDto {
    private Long rentId;

    private String name;

    private Integer rank;

    private Integer previousRank;

    private Integer reservationCount;

    private String regionFullName;

    private String regionShortName;

    private String streetAddress;

    private String thumbnail;

    private Double rating;


    public RankedRentDto(Rent rent, Integer rank, Integer sum) {
        rentId = rent.getRentId();
        name = rent.getName();
        this.rank = rank;
        reservationCount = sum;
        regionFullName = rent.getRegion().getFullName();
        regionShortName = rent.getRegion().getShortName();
        streetAddress = rent.getStreetAddress();
        thumbnail = rent.getThumbnail();
    }
}
