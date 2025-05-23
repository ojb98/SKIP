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

}
