package com.example.skip.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Data
@ConfigurationProperties(prefix = "spring.security.oauth2.client.registration")
public class OAuth2Properties {
    private final Kakao kakao = new Kakao();

    private final Naver naver = new Naver();


    @Data
    public static class Kakao {
        private String clientName;

        private String clientId;

        private String clientSecret;

        private String redirectUri;

        private List<String> scope;
    }

    @Data
    public static class Naver {
        private String clientName;

        private String clientId;

        private String clientSecret;

        private String redirectUri;

        private List<String> scope;
    }
}
