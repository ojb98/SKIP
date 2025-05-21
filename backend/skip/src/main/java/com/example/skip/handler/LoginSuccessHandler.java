package com.example.skip.handler;

import com.example.skip.dto.UserDto;
import com.example.skip.util.JwtUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        UserDto userDto = (UserDto) authentication.getPrincipal();
        Map<String, Object> claims = userDto.getClaims();

        Cookie accessCookie = new Cookie("accessToken", jwtUtil.generateAccessToken(claims));
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge((int) JwtUtil.accessTokenValidity);

        Cookie refreshCookie = new Cookie("refreshToken", jwtUtil.generateRefreshToken(userDto.getUsername()));
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) JwtUtil.refreshTokenValidity);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        Gson gson = new Gson();
        String json = gson.toJson(Map.of("success", true));
        response.setContentType("application/json;charset=utf-8");
        PrintWriter pw = response.getWriter();
        pw.println(json);
        pw.close();
    }
}
