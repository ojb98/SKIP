package com.example.skip.service;

import com.example.skip.config.BizApiConfig;
import com.example.skip.dto.BizApiDTO;
import com.example.skip.dto.BizApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BizApiService {

    private final BizApiConfig bizApiConfig;  // BizApiConfig 주입

    private final RestTemplate restTemplate = new RestTemplate();

    public BizApiDTO callBizApi(String bizRegNumber) {
        String url = bizApiConfig.getUrl();  // BizApiConfig에서 URL 가져오기
        String serviceKey = bizApiConfig.getServiceKey();  // BizApiConfig에서 서비스 키 가져오기

        String fullUrl = url + "?serviceKey=" + serviceKey;  // URL에 서비스 키 추가

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("b_no", List.of(bizRegNumber));  // 사업자 등록번호 리스트 형태로 전달

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<BizApiResponse> response = restTemplate.exchange(
                fullUrl,
                HttpMethod.POST,
                request,
                BizApiResponse.class
        );

        // 응답에서 첫 번째 사업자 정보 꺼내기
        return response.getBody().getData().get(0);
    }
}
