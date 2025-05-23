package com.example.skip.controller;

import com.example.skip.dto.ApiResponseDto;
import com.example.skip.dto.UserDto;
import com.example.skip.exception.CustomJwtException;
import com.example.skip.service.CustomUserDetailsService;
import com.example.skip.service.RefreshTokenService;
import com.example.skip.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

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
    public ApiResponseDto refresh(HttpServletRequest request, HttpServletResponse response) throws NullPointerException {
        String accessToken = jwtUtil.extractToken("accessToken", request);
        String refreshToken = jwtUtil.extractToken("refreshToken", request);

        // 액세스 토큰이 존재하지 않는 경우
        if (accessToken == null) {
            Map<String, Object> claims = jwtUtil.validateToken(refreshToken);
            String username = (String) claims.get("username");
            String serverRefreshToken = refreshTokenService.getRefreshToken(username);
            if (refreshToken.equals(serverRefreshToken)) { // 리프레시 토큰이 서버와 일치함
                UserDto userDto = (UserDto) customUserDetailsService.loadUserByUsername(username);
                String newAccessToken = jwtUtil.generateAccessToken(userDto.getClaims());
                jwtUtil.attachToken("accessToken", newAccessToken, response, JwtUtil.accessTokenValidity);
                if (checkTime((long) claims.get("exp"))) {
                    String newRefreshToken = jwtUtil.generateRefreshToken(userDto.getUsername());
                    jwtUtil.attachToken("refreshToken", newRefreshToken, response, JwtUtil.refreshTokenValidity);
                }
                return new ApiResponseDto(true, null);
            } else {
                return new ApiResponseDto(false, "INVALID_REFRESH");
            }
        }
        return new ApiResponseDto(false, "VALID_ACCESS_TOKEN");
    }

    @ExceptionHandler(NullPointerException.class)
    public ApiResponseDto handleNPE() {
        return new ApiResponseDto(false, "NULL_POINTER");
    }

    @ExceptionHandler(CustomJwtException.class)
    public ApiResponseDto handleCJE() {
        return new ApiResponseDto(false, "INVALID_REFRESH");
    }
}
