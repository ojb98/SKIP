package com.example.skip.dto.request;

import lombok.Data;

@Data
public class SingleValueRequest<T> {
    private T value;
}
