package com.example.skip.config;

import com.example.skip.filter.JwtFilter;
import com.example.skip.handler.CustomAccessDeniedHandler;
import com.example.skip.handler.LoginFailureHandler;
import com.example.skip.handler.LoginSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource corsConfigurationSource =new UrlBasedCorsConfigurationSource();
        corsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .sessionManagement(httpSecuritySessionManagementConfigurer -> {
                    httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.NEVER);
                })
                .csrf(httpSecurityCsrfConfigurer -> {
                    httpSecurityCsrfConfigurer.disable();
                })
                .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> {
                    authorizationManagerRequestMatcherRegistry
                            .anyRequest()
                            .permitAll();
                })
                .formLogin(httpSecurityFormLoginConfigurer -> {
                    httpSecurityFormLoginConfigurer
                            .loginPage("/user/login")
                            .usernameParameter("username")
                            .passwordParameter("password")
                            .successHandler(new LoginSuccessHandler())
                            .failureHandler(new LoginFailureHandler());
                })
                .cors(httpSecurityCorsConfigurer -> {
                    httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
                })
                .exceptionHandling(httpSecurityExceptionHandlingConfigurer -> {
                    httpSecurityExceptionHandlingConfigurer
                            .accessDeniedHandler(new CustomAccessDeniedHandler());
                })
                .addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class).build();
    }
}
