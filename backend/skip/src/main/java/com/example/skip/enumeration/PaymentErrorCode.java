package com.example.skip.enumeration;

public enum PaymentErrorCode {
    PAYMENT_VERIFICATION_FAILED("결제 정보 조회 실패"),
    AMOUNT_MISMATCH("결제 금액 불일치"),
    STOCK_SHORTAGE("재고 부족"),
    USER_NOT_FOUND("유저 없음"),
    RENT_NOT_FOUND("렌트 정보 없음"),
    CART_ITEM_NOT_FOUND("카트 아이템 없음"),
    ITEM_DETAIL_NOT_FOUND("아이템 상세 정보 없음"),
    PAYMENT_CANCEL_FAIL("결제 취소 실패"),
    UNKNOWN_ERROR("알 수 없는 오류"),
    PAYMENT_NOT_FOUND("결제 없음");

    private final String message;

    PaymentErrorCode(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
