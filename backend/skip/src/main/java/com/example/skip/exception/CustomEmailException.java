package com.example.skip.exception;

public class CustomEmailException extends RuntimeException {
    public CustomEmailException(String message) {
        super(message);
    }
}
