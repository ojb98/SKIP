package com.example.skip.enumeration;

public enum RentCategory {
    SKI("스키"),
    RENT("렌탈샵");

    private final String displayName;

    RentCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
