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


    public void saveRefreshToken(String username, String deviceId, String refreshToken) {
        stringRedisTemplate.opsForValue().set("refreshToken:" + username + ":" + deviceId, refreshToken, Duration.ofMillis(JwtUtil.refreshTokenValidity));
    }

    public String getRefreshToken(String username, String deviceId) {
        return stringRedisTemplate.opsForValue().get("refreshToken:" + username + ":" + deviceId);
    }

    public void deleteRefreshToken(String username, String deviceId) {
        stringRedisTemplate.delete("refreshToken:" + username + ":" + deviceId);
    }
}
