package com.example.skip.dto.rent;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시
public class BizApiResponse {
    private List<BizApiDTO> data;  //사업자등록 실제 데이터 정보 목록
}
