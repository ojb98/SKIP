package com.example.skip.filter;

import com.example.skip.dto.UserDto;
import com.example.skip.service.CustomUserDetailsService;
import com.example.skip.util.JwtUtil;
import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    private final CustomUserDetailsService customUserDetailsService;


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // 마이페이지, 예약 처리, 결제 처리, 어드민 페이지 같은 로그인이 필요한 경우 추가
        if (path.startsWith("/user/profile")) {
            return false;
        }
        return true;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            Map<String, String> tokens = jwtUtil.extractToken(request);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername((String) jwtUtil.validateToken(tokens.get("accessToken")).get("username"));

            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(Map.of("success", false));
            response.setContentType("application/json;charset=utf-8");
            PrintWriter pw = response.getWriter();
            pw.println(jsonStr);
            pw.close();
        }
    }
}
