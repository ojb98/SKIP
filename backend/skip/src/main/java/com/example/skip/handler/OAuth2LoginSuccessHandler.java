package com.example.skip.handler;

import com.example.skip.dto.UserDto;
import com.example.skip.service.RefreshTokenService;
import com.example.skip.util.JwtUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    @Value("${api.host}")
    private String host;

    private final JwtUtil jwtUtil;

    private final RefreshTokenService refreshTokenService;

    private final OAuth2AuthorizedClientManager oAuth2AuthorizedClientManager;

    private final OAuth2AuthorizedClientService oAuth2AuthorizedClientService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;

        OAuth2AuthorizeRequest oAuth2AuthorizeRequest = OAuth2AuthorizeRequest
                .withClientRegistrationId(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())
                .principal(oAuth2AuthenticationToken)
                .build();

        System.out.println(oAuth2AuthenticationToken.getName() + oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());

        OAuth2AuthorizedClient oAuth2AuthorizedClient = oAuth2AuthorizedClientManager.authorize(oAuth2AuthorizeRequest);

        oAuth2AuthorizedClientService.saveAuthorizedClient(oAuth2AuthorizedClient, oAuth2AuthenticationToken);

        UserDto userDto = (UserDto) authentication.getPrincipal();
        Map<String, Object> claims = userDto.getClaims();

        String refreshToken = jwtUtil.generateRefreshToken(userDto.getUsername());

        String deviceId = request.getHeader("deviceId");

        // 쿠키 저장
        jwtUtil.attachToken("accessToken", jwtUtil.generateAccessToken(claims), response, JwtUtil.accessTokenValidity);
        jwtUtil.attachToken("refreshToken", refreshToken, response, JwtUtil.refreshTokenValidity);

        // 레디스 저장
        refreshTokenService.saveRefreshToken(userDto.getUsername(), deviceId, refreshToken);

        response.sendRedirect("http://" + host + ":5173");
    }
}
