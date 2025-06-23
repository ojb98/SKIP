package com.example.skip.dto.response;

import com.example.skip.enumeration.ItemCategory;

public record ItemCategoryRecord(String value, String displayName) {
    public static ItemCategoryRecord fromItemCategory(ItemCategory itemCategory) {
        return new ItemCategoryRecord(itemCategory.name(), itemCategory.getDisplayName());
    }
}
