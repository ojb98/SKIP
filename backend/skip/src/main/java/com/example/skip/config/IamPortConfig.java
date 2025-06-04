package com.example.skip.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "iamport")
public class IamPortConfig {
    private String apiKey;
    private String secretKey;

}
