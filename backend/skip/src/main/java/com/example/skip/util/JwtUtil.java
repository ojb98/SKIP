package com.example.skip.util;

import com.example.skip.exception.CustomJwtException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtil {
    @Value("${spring.security.jwt.key}")
    public String key;

    private SecretKey secretKey;

    public final static long accessTokenValidity = 10 * 60 * 1000; // 10분

    public final static long refreshTokenValidity = 7 * 24 * 60 * 60 * 1000; // 1주


    @PostConstruct
    public void init() {
        secretKey = Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Map<String, Object> claims) {
        return Jwts.builder()
                .header()
                .type("JWT")
                .and()
                .subject(claims.get("username").toString())
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(secretKey).compact();
    }

    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .header()
                .type("JWT")
                .and()
                .subject(username)
                .claims(Map.of("username", username))
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
                .signWith(secretKey).compact();
    }

    public Map<String, Object> validateToken(String token) {
        Map<String, Object> claims = null;
        try {
            claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseClaimsJws(token) // 유효한 토큰이 아니면 예외 발생
                    .getPayload();
        } catch (MalformedJwtException e) {
            throw new CustomJwtException("Malformed");
        } catch (InvalidClaimException e) {
            throw new CustomJwtException("Invalid");
        } catch (JwtException e) {
            throw new CustomJwtException("JWTError");
        } catch (Exception e) {
            throw new CustomJwtException("Error");
        }
        return claims;
    }

    public void attachToken(String tokenName, String token, HttpServletResponse response, long validity) {
        ResponseCookie responseCookie = ResponseCookie.from(tokenName, token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge((int) TimeUnit.MILLISECONDS.toSeconds(validity)).build();

        response.addHeader("Set-Cookie", responseCookie.toString());
    }

    public String extractToken(String tokenName, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie: cookies) {
                if (cookie.getName().equals(tokenName)) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        return token;
    }
}
