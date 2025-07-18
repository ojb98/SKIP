package com.example.skip.util;

import com.example.skip.config.IamPortConfig;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class IamportTokenUtil {

    private final IamPortConfig iamPortConfig;
    // JSON ↔ 객체 변환을 위한 Jackson 클래스
    private final ObjectMapper objectMapper = new ObjectMapper();
    // HTTP 클라이언트 객체 생성
    private final OkHttpClient client = new OkHttpClient();;


    public String getIamportToken() throws IOException {
        // 직렬화
        String json = objectMapper.writeValueAsString(Map.of(
                "imp_key", iamPortConfig.getApiKey(),
                "imp_secret", iamPortConfig.getSecretKey()
        ));

        // 아임포트 토큰 요청 생성
        Request request = new Request.Builder()
                .url("https://api.iamport.kr/users/getToken")
                // JSON을 HTTP POST 요청 바디로 변환
                .post(RequestBody.create(json, MediaType.get("application/json")))
                .build();

        // client.newCall(authRequest) : HTTP 요청을 실행할 준비를 마친 Call 객체
        // execute() : 동기(synchronous) 방식
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("아임포트 토큰 발급 실패: " + response.body().string());
            }

            // 응답에서 access_token을 추출 (트리 구조로 역직렬화)
            return objectMapper.readTree(response.body().string())
                    .get("response").get("access_token").asText();
        }
    }

    // 사전 등록 기능(사기성 결제, 조작된 금액 등을 서버에서 걸러주는 중요한 검증 메서드)
    public void prepareIamportPayment(String token, String merchantUid, long amount) throws IOException {
        // 요청 JSON 구성
        ObjectMapper objectMapper = new ObjectMapper();

        ObjectNode body = objectMapper.createObjectNode();
        body.put("merchant_uid", merchantUid);
        body.put("amount", amount);

        String jsonBody = objectMapper.writeValueAsString(body);

        // HTTP 요청 생성
        Request request = new Request.Builder()
                .url("https://api.iamport.kr/payments/prepare")
                .post(RequestBody.create(
                        jsonBody,
                        MediaType.parse("application/json")
                ))
                .addHeader("Authorization", token)  // 아임포트 액세스 토큰
                .build();

        // 요청 실행
        try (Response response = new OkHttpClient().newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("아임포트 결제 사전 등록 실패: " + response.body().string());
            }
        }
    }
}
