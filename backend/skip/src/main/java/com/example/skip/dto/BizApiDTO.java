package com.example.skip.dto;

import com.example.skip.enumeration.YesNo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시
public class BizApiDTO {
    @JsonProperty("b_no")
    private String bizRegNumber;  // 사업자 등록 번호

    @JsonProperty("b_stt_cd")
    private String bizStatus;  // 유효성 여부

    @JsonProperty("utcc_yn")
    private String bizClosureFlag;  // (Y:휴업:폐업/N:정상)

}