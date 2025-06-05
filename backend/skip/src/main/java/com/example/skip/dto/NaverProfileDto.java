package com.example.skip.dto;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Data
public class NaverProfileDto {
    private String naverId;

    private String username;

    private String email;

    private String name;

    private String mobile;

    private String profileImage;


    public NaverProfileDto(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        naverId = (String) response.get("id");
        username = "Naver_" + naverId;
        email = (String) response.get("email");
        name = (String) response.get("name");
        mobile = (String) response.get("mobile");
        profileImage = (String) response.get("profile_image");
    }
}
