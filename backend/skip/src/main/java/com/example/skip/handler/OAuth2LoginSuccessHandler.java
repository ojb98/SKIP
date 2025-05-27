package com.example.skip.handler;

import com.example.skip.dto.UserDto;
import com.example.skip.service.RefreshTokenService;
import com.example.skip.util.JwtUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizationSuccessHandler;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;

    private final RefreshTokenService refreshTokenService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        UserDto userDto = (UserDto) authentication.getPrincipal();
        Map<String, Object> claims = userDto.getClaims();

        String refreshToken = jwtUtil.generateRefreshToken(userDto.getUsername());

        // 쿠키 저장
        jwtUtil.attachToken("accessToken", jwtUtil.generateAccessToken(claims), response, JwtUtil.accessTokenValidity);
        jwtUtil.attachToken("refreshToken", refreshToken, response, JwtUtil.refreshTokenValidity);

        // 레디스 저장
        refreshTokenService.saveRefreshToken(userDto.getUsername(), refreshToken);

        response.sendRedirect("http://localhost:5173/");
    }
}
