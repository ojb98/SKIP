package com.example.skip.enumeration;

public enum EnumPayment {
    SUCCESS,  // 결제 성공
    PENDING,  // 결제 대기 중(무통장입금,가상계좌)
    CANCELLED, // 결제 취소됨
}
