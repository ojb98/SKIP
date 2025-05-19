package com.example.skip.util;

import jakarta.servlet.http.HttpServletRequest;

public class JwtUtil {
    private static String key = "1234567890123456789012345678901234567890";

    public String generateToken() {

    }

    public String extractToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
