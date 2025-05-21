package com.example.skip.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BizApiDTO {
    @JsonProperty("b_no")
    private String bizRegNumber;  // 사업자 등록 번호

    @JsonProperty("b_stt")
    private String regStatus;  // 사업자 상태 (계속사업자 등)

    @JsonProperty("b_stt_cd")
    private String regStatusCode;  // 사업자 상태 코드

    @JsonProperty("tax_type")
    private String taxType;  // 세금 유형 (부가가치세 일반과세자 등)

    @JsonProperty("tax_type_cd")
    private String taxTypeCode;  // 세금 유형 코드

    @JsonProperty("end_dt")
    private String endDate;  // 종료 날짜 (없으면 빈 문자열)

    @JsonProperty("utcc_yn")
    private String utccYn;  // UTC 여부 (Y/N)

    @JsonProperty("tax_type_change_dt")
    private String taxTypeChangeDate;  // 세금 유형 변경 날짜

    @JsonProperty("invoice_apply_dt")
    private String invoiceApplyDate;  // 인보이스 적용 날짜

    @JsonProperty("rbf_tax_type")
    private String rbfTaxType;  // RBF 세금 유형

    @JsonProperty("rbf_tax_type_cd")
    private String rbfTaxTypeCode;  // RBF 세금 유형 코드
}
