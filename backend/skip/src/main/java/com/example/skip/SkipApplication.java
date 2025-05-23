package com.example.skip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class SkipApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkipApplication.class, args);
	}

}
