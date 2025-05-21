package com.example.skip.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BizApiDTO {
    @JsonProperty("b_no")
    private String bizRegNumber;

    @JsonProperty("valid")
    private String isValid;

    @JsonProperty("b_stt")
    private String regNumberValidity;

    @JsonProperty("tax_type_change_dt")
    private String regCheckDate;
}
