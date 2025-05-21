package com.example.skip.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-path}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /images/** 경로로 접근할때, 실제 저장된 로컬 파일 경로로 매핑
        registry.addResourceHandler("/images/**")  // /images/모든요청경로
                .addResourceLocations("file:///"+uploadDir);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS 설정: 모든 경로에 대해 localhost:5173에서 오는 요청을 허용
        registry.addMapping("/api/**")  // API 요청 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:5173")  // 허용할 클라이언트 도메인
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")  // 허용할 HTTP 메소드
                .allowedHeaders("*")  // 허용할 헤더
                .allowCredentials(true);  // 쿠키나 인증 정보를 함께 보낼 수 있게 허용
    }


}
