package com.example.skip.dto.rent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkiLocationDto {
    private Long rentId;

    private String name;

    private String basicAddress;

    private String streetAddress;

    private String detailedAddress;

    private Double latitude;

    private Double longitude;
}
