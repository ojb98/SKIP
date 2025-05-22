package com.example.skip.service;

import com.example.skip.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final StringRedisTemplate stringRedisTemplate;


    public void saveRefreshToken(String username, String refreshToken) {
        stringRedisTemplate.opsForValue().set("refreshToken:" + username, refreshToken, Duration.ofMillis(JwtUtil.refreshTokenValidity));
    }

    public String getRefreshToken(String username) {
        return stringRedisTemplate.opsForValue().get("refreshToken:" + username);
    }

    public void deleteRefreshToken(String username) {
        stringRedisTemplate.delete("refreshToken:" + username);
    }
}
