package com.example.skip.dto;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Data
public class KakaoProfileDto {
    private String kakaoId;

    private String username;

    private String email;

    private String profileImageUrl;


    public KakaoProfileDto(Map<String, Object> attributes) {
        kakaoId = ((Long) attributes.get("id")).toString();
        username = "Kakao_" + kakaoId;
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        email = (String) kakaoAccount.get("email");
        profileImageUrl = (String) kakaoAccount.get("profile_image_url");
        System.out.println(properties);
    }
}
