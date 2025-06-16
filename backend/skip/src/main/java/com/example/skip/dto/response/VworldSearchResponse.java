package com.example.skip.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class VworldSearchResponse {
    private Response response;

    @Data
    public static class Response {
        private Result result;
    }

    @Data
    public static class Result {
        private List<Item> items;
    }

    @Data
    public static class Item {
        private Point point;
    }

    @Data
    public static class Point {
        private String x;

        private String y;
    }
}
