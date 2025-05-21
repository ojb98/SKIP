package com.example.skip.service;

import com.example.skip.config.BizApiConfig;
import com.example.skip.dto.BizApiDTO;
import com.example.skip.dto.BizApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BizApiService {

    private final BizApiConfig bizApiConfig;  // BizApiConfig 주입

    private final RestTemplate restTemplate = new RestTemplate();

    public BizApiDTO callBizApi(String bizRegNumber) throws URISyntaxException {
        // 서비스 URL과 서비스 키 가져오기
        String url = bizApiConfig.getUrl();
        String serviceKey = bizApiConfig.getServiceKey();  // 서비스키는 인코딩해야 할 필요가 없습니다.

        // URI 생성 (서비스키를 쿼리 파라미터로 추가)
        String finalUrl = url + "?serviceKey=" + serviceKey;
        URI uri = new URI(finalUrl);  // URI 객체로 변환

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 요청 바디에 사업자 등록번호(b_no) 추가
        Map<String, Object> body = new HashMap<>();
        body.put("b_no", Arrays.asList(bizRegNumber));  // 사업자 번호를 리스트로 감싸서 전달

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // POST 요청을 보내고 응답 받기
        ResponseEntity<BizApiResponse> response = restTemplate.exchange(
                uri,
                HttpMethod.POST,
                entity,
                BizApiResponse.class
        );

        // 응답에서 첫 번째 사업자 정보 꺼내기
        return response.getBody().getData().get(0);  // 데이터 리스트에서 첫 번째 사업자 정보 반환
    }
}
