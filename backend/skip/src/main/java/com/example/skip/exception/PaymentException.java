package com.example.skip.exception;

import com.example.skip.enumeration.PaymentErrorCode;

public class PaymentException extends RuntimeException {
    private final PaymentErrorCode errorCode;

    public PaymentException(PaymentErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public PaymentException(PaymentErrorCode errorCode, String detail) {
        super(errorCode.getMessage() + ": " + detail);
        this.errorCode = errorCode;
    }

    public PaymentErrorCode getErrorCode() {
        return errorCode;
    }
}
