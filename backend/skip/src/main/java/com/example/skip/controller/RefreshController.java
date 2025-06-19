package com.example.skip.controller;

import com.example.skip.dto.response.ApiResponse;
import com.example.skip.dto.UserDto;
import com.example.skip.exception.CustomJwtException;
import com.example.skip.service.CustomUserDetailsService;
import com.example.skip.service.RefreshTokenService;
import com.example.skip.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RefreshController {
    private final RefreshTokenService refreshTokenService;

    private final CustomUserDetailsService customUserDetailsService;

    private final JwtUtil jwtUtil;


    private boolean checkTime(Long exp) {
        return (exp - TimeUnit.MILLISECONDS.toSeconds(System.currentTimeMillis())) < 24 * 60 * 60; // 만료 시간이 하루 보다 적게 남았을 때
    }

    @PostMapping("/user/refresh")
    public ApiResponse refresh(HttpServletRequest request, HttpServletResponse response) throws NullPointerException {
        log.info("연장 시도중...");
        String accessToken = jwtUtil.extractToken("accessToken", request);
        String refreshToken = jwtUtil.extractToken("refreshToken", request);
        String deviceId = request.getHeader("X-Device-Id");
        if (deviceId == null) {
            return ApiResponse.builder()
                    .success(false)
                    .data("DEVICE_ID_IS_NULL!")
                    .build();
        }

        log.info("refresh: {}", refreshToken);

        // 액세스 토큰이 존재하지 않는 경우
        if (accessToken == null) {
            Map<String, Object> claims = jwtUtil.validateToken(refreshToken);
            String username = (String) claims.get("username");
            String serverRefreshToken = refreshTokenService.getRefreshToken(username, deviceId);
            if (refreshToken.equals(serverRefreshToken)) { // 리프레시 토큰이 서버와 일치함
                UserDto userDto = (UserDto) customUserDetailsService.loadUserByUsername(username);
                String newAccessToken = jwtUtil.generateAccessToken(userDto.getClaims());
                jwtUtil.attachToken("accessToken", newAccessToken, response, JwtUtil.accessTokenValidity);
                if (checkTime((long) claims.get("exp"))) {
                    String newRefreshToken = jwtUtil.generateRefreshToken(userDto.getUsername());
                    jwtUtil.attachToken("refreshToken", newRefreshToken, response, JwtUtil.refreshTokenValidity);
                }
                return new ApiResponse(true, null);
            } else {
                return new ApiResponse(false, "INVALID_REFRESH");
            }
        }
        return new ApiResponse(false, "VALID_ACCESS_TOKEN");
    }

    @ExceptionHandler(NullPointerException.class)
    public ApiResponse handleNPE() {
        return new ApiResponse(false, "NULL_POINTER");
    }

    @ExceptionHandler(CustomJwtException.class)
    public ApiResponse handleCJE() {
        return new ApiResponse(false, "INVALID_REFRESH");
    }
}
