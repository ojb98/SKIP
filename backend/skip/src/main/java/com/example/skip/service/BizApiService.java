package com.example.skip.service;

import com.example.skip.config.BizApiConfig;
import com.example.skip.dto.BizApiDTO;
import com.example.skip.dto.BizApiResponse;
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

    private final BizApiConfig bizApiConfig;  // BizApiConfig 주입
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();  // Jackson 사용

    public BizApiDTO callBizApi(String bizRegNumber) {
        String url = bizApiConfig.getUrl();
        String serviceKey = URLEncoder.encode(bizApiConfig.getServiceKey(), StandardCharsets.UTF_8);
        String fullUrl = url + "?serviceKey=" + serviceKey;

        System.out.println("fullUrl ==> " + fullUrl);

        // 요청 바디 JSON 생성
        Map<String, Object> body = new HashMap<>();
        body.put("b_no", List.of(bizRegNumber)); // b_no는 배열 형태로 전달

        String jsonBody;
        try {
            jsonBody = objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 직렬화 실패", e);
        }

        // MediaType 정의 (OkHttp 4.x 기준)
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        RequestBody requestBody = RequestBody.create(jsonBody, mediaType);

        // OkHttp 요청 생성
        Request request = new Request.Builder()
                .url(fullUrl)
                .post(requestBody)
                .build();

        // 요청 실행 및 응답 처리
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected response code: " + response.code() + ", message: " + response.message());
            }

            ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new IOException("응답 바디가 null입니다.");
            }

            String responseString = responseBody.string();
            BizApiResponse bizApiResponse = objectMapper.readValue(responseString, BizApiResponse.class);

            // 데이터가 없을 경우 예외 처리
            if (bizApiResponse.getData() == null || bizApiResponse.getData().isEmpty()) {
                throw new RuntimeException("응답 데이터가 비어 있습니다.");
            }

            return bizApiResponse.getData().get(0);
        } catch (IOException e) {
            throw new RuntimeException("API 요청 실패", e);
        }
    }


}
