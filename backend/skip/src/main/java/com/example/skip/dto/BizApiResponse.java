package com.example.skip.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BizApiResponse {
    private List<BizApiDTO> data;  //사업자등록 실제 데이터 정보 목록
}
