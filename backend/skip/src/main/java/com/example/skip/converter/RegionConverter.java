package com.example.skip.converter;

import com.example.skip.enumeration.Region;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class RegionConverter implements AttributeConverter<Region, String> {
    @Override
    public String convertToDatabaseColumn(Region region) {
        return region != null ? region.getFullName() : null;
    }

    @Override
    public Region convertToEntityAttribute(String string) {
        if (string != null && !string.isEmpty()) {
            for (Region region: Region.values()) {
                if (region.getFullName().equals(string)) {
                    return region;
                }
            }
        }

        return Region.ETC;
    }
}
