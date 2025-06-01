package com.example.skip.service;

import com.example.skip.config.BizApiConfig;
import com.example.skip.dto.rent.BizApiDTO;
import com.example.skip.dto.rent.BizApiResponse;
import com.example.skip.repository.RentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import okhttp3.MediaType;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BizApiService {
    private final RentRepository rentRepository;

    private final BizApiConfig bizApiConfig;  // BizApiConfig 주입
    //OkHttp라이브러리에서 HTTP 요청을 보내고 응답을 받는 클라이언트 객체입니다.
    private final OkHttpClient client = new OkHttpClient();
    //JSON을 자바 객체로 바꾸거나 그 반대로 바꾸는 도구입니다. (Jackson 사용)
    private final ObjectMapper objectMapper = new ObjectMapper();

    public BizApiDTO callBizApi(String bizRegNumber) {
        String url = bizApiConfig.getUrl();
        //디코딩 인증키를 인코딩 인증키로 변환
        String serviceKey = URLEncoder.encode(bizApiConfig.getServiceKey(), StandardCharsets.UTF_8);
        String fullUrl = url + "?serviceKey=" + serviceKey;

        System.out.println("fullUrl ==> " + fullUrl);

        // 요청 바디(body) JSON 생성
        Map<String, Object> body = new HashMap<>();
        body.put("b_no", List.of(bizRegNumber)); // b_no는 배열 형태로 전달 (예: { "b_no": ["2268124374"] })

        String jsonBody;
        try {
            jsonBody = objectMapper.writeValueAsString(body);  //JSON 문자열로 변환
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 직렬화 실패", e);
        }

        //HTTP 요청의 본문 타입을 JSON 형식으로 지정
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        //requestBody는 보낼 내용을 의미해요 (JSON 문자열)
        RequestBody requestBody = RequestBody.create(jsonBody, mediaType);

        //HTTP POST 요청 객체를 생성
        Request request = new Request.Builder()
                .url(fullUrl)
                .post(requestBody)
                .build();

        // 요청 실행 및 응답 처리 (OkHttp로 API 요청을 보냄)
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {  //요청이 실패했는지 확인
                throw new IOException("Unexpected response code: " + response.code() + ", message: " + response.message());
            }

            //응답 본문이 비어있으면 오류 처리
            ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new IOException("응답 바디가 null입니다.");
            }

            //응답 JSON 문자열을 자바 객체(BizApiResponse)로 변환
            String responseString = responseBody.string();
            BizApiResponse bizApiResponse = objectMapper.readValue(responseString, BizApiResponse.class);

            // 데이터가 없을 경우 예외 처리 (data 배열이 없거나 비어 있으면 오류 처리)
            if (bizApiResponse.getData() == null || bizApiResponse.getData().isEmpty()) {
                throw new RuntimeException("응답 데이터가 비어 있습니다.");
            }

            //data 배열 중 첫 번째 사업자 정보 객체를 반환
            return bizApiResponse.getData().get(0);

        } catch (IOException e) {
            throw new RuntimeException("API 요청 실패", e);
        }
    }

    // 렌탈테이블에 사업자등록번호 중복여부
    public boolean isBizRegNumberDuplicate(String bizRegNumber) {
        return rentRepository.existsByBizRegNumber(bizRegNumber);
    }


}
