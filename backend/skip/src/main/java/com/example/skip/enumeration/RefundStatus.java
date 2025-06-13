package com.example.skip.enumeration;

public enum RefundStatus {
    REQUESTED,   // 사용자 환불 요청 접수
    COMPLETED,   // 관리자 승인 및 포트원 환불 성공
    REJECTED     // 관리자에 의해 거절됨
}
