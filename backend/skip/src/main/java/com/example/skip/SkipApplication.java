package com.example.skip;

import com.example.skip.config.properties.OAuth2Properties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableCaching  //캐시(Cache) 기능을 활성화
@EnableScheduling   //스케줄링 기능을 활성화
@EnableJpaAuditing  // JPA 엔티티 생성/수정 시간 자동 처리
@SpringBootApplication
@EnableConfigurationProperties(OAuth2Properties.class)
public class SkipApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkipApplication.class, args);
	}

}
