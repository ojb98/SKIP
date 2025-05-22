package com.example.skip.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
//application.yml에 정의된 설정값들을 자바 객체에 바인딩해주는 어노테이션
@ConfigurationProperties(prefix = "biz.api")
public class BizApiConfig {
    private String url;
    private String serviceKey;

    public String getUrl(){
        return url;
    }

    public void setUrl(String url){
        this.url=url;
    }

    public String getServiceKey(){
        return serviceKey;
    }

    public void setServiceKey(String serviceKey){
        this.serviceKey=serviceKey;
    }
}
