package com.example.skip.enumeration;

public enum ItemCategory {
    LIFT_TICKET("리프트권"),
    PACKAGE("패키지"),
    SKI("스키"),
    SNOWBOARD("보드"),
    PROTECTIVE_GEAR("보호구"),
    TOP("상의"),
    BOTTOM("하의"),
    BOOTS("신발");

    private final String displayName;

    ItemCategory(String displayName){
        this.displayName=displayName;
    }

    public String getDisplayName(){
        return displayName;
    }
}
