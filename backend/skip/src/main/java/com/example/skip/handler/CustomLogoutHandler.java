package com.example.skip.handler;

import com.example.skip.dto.UserDto;
import com.example.skip.service.RefreshTokenService;
import com.google.gson.Gson;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import java.io.PrintWriter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {
    private final RefreshTokenService refreshTokenService;


    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // 쿠키 삭제
        Cookie accessCookie = new Cookie("accessToken", null);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);

        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        // 레디스 삭제
        String username = ((UserDto) authentication.getPrincipal()).getUsername();
        String deviceId = request.getHeader("X-Device-Id");
        refreshTokenService.deleteRefreshToken(username, deviceId);

        // 시큐리티에서 로그아웃
        SecurityContextHolder.clearContext();
        System.out.println("로그아웃 성공!");
    }
}
