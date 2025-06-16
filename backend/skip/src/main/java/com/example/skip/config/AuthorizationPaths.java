package com.example.skip.config;

import java.util.List;

public class AuthorizationPaths {
    public static final List<String> PERMIT_ALL = List.of(
            "/images/**", // 이미지 url
            "/user/signup",
            "/user/login",
            "/user/find/username",
            "/user/email/verify",
            "/user/email/compare-and-verify",
            "/user/email/confirm",
            "/ski/**",
            "/api/banners/list/order",
            "/api/banners/*/click",
            "/api/items/**"
    );

    public static final List<String> ROLE_USER = List.of(

    );

    public static final List<String> ROLE_MANAGER = List.of(

    );

    public static final List<String> ROLE_ADMIN = List.of(

    );
}
