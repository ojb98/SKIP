package com.example.skip.dto.response;

import com.example.skip.enumeration.Region;

public record RegionRecord(String value, String fullName, String shortName) {
    public static RegionRecord fromRegion(Region region) {
        return new RegionRecord(region.name(), region.getFullName(), region.getShortName());
    }
}
