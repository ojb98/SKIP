package com.example.skip.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@RequiredArgsConstructor
public class S3Config {

    private final AwsKeyConfig awsKeyConfig;


    @Bean
    public S3Client s3Client(){
        return S3Client.builder()
                .region(Region.AP_NORTHEAST_2)  // 서울 리전
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(awsKeyConfig.getAccessKey(), awsKeyConfig.getSecretKey())
                        )
                )
                .build();
    }

}
