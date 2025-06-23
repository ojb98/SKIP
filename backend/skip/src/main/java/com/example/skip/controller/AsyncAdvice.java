package com.example.skip.controller;

import com.example.skip.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.concurrent.ExecutionException;

@RestControllerAdvice
public class AsyncAdvice {
    @ExceptionHandler(InterruptedException.class)
    public ApiResponse handleInterruptedException(InterruptedException e) {
        e.printStackTrace();
        return ApiResponse.builder()
                .success(false)
                .data(e.getCause().getMessage())
                .build();
    }

    @ExceptionHandler(ExecutionException.class)
    public ApiResponse handleExecutionException(ExecutionException e) {
        e.printStackTrace();
        return ApiResponse.builder()
                .success(false)
                .data(e.getCause().getMessage())
                .build();
    }
}
