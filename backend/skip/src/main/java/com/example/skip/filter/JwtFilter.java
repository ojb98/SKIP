package com.example.skip.filter;

import com.example.skip.config.AuthorizationPaths;
import com.example.skip.service.UserService;
import com.example.skip.util.JwtUtil;
import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    private final UserService userService;

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // 마이페이지, 예약 처리, 결제 처리, 어드민 페이지 같은 로그인이 필요한 경우 추가
        List<String> excludePaths = Arrays.asList(
                "/user/logout",
                "/user/profile",
                "/user/password/change",
                "/user/password/set",
                "/user/delete",
                "/api/reviews",
                "/user/delete",
                "/user/social",
                "/user/nickname/change",
                "/user/username/change",
                "/user/email/change",
                "/user/name/change",
                "/user/phone/change",
                "/user/image/change",
                "/api/reservations/search"
        );

        log.info("path: {}, match: {}", path, AuthorizationPaths.PERMIT_ALL.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, path)));
        return AuthorizationPaths.PERMIT_ALL.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, path));

//        return excludePaths.stream().noneMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        String path = request.getRequestURI();
//        boolean shouldNotFilter = AuthorizationPaths.PERMIT_ALL.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, path));
//        log.info("path: {}, match: {}", path, shouldNotFilter);
//        if (shouldNotFilter) {
//            filterChain.doFilter(request, response);
//            return;
//        }

        try {
            String accessToken = jwtUtil.extractToken("accessToken", request);
            log.info("accessToken: {}, request: {}", accessToken, request.getRequestURI());
            Long userId = ((Number) jwtUtil.validateToken(accessToken).get("userId")).longValue();
            UserDetails userDetails = userService.getUser(userId);

            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(Map.of("success", false, "error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json;charset=utf-8");
            PrintWriter pw = response.getWriter();
            pw.println(jsonStr);
            pw.close();
        }
    }
}
