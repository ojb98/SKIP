package com.example.skip.enumeration;

public enum ReservationStatus {
    RESERVED,  // 예약 완료
    RETURNED,  // 반납 완료
    CANCELLED,  // 전체예약 취소
    PARTIALLY_CANCELLED,  // 부분 취소
    PARTIALLY_RETURNED,   //부분 반납
    READY,
}
