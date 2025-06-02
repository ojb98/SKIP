package com.example.skip.config;

import com.example.skip.filter.JwtFilter;
import com.example.skip.handler.*;
import com.example.skip.service.CustomOAuth2UserService;
import com.example.skip.service.CustomUserDetailsService;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Map;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomUserDetailsService customUserDetailsService;

    private final CustomOAuth2UserService customOAuth2UserService;

    private final LoginSuccessHandler loginSuccessHandler;

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    private final CustomLogoutHandler customLogoutHandler;

    private final JwtFilter jwtFilter;


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
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, JwtFilter jwtFilter) throws Exception {
        return httpSecurity
                .sessionManagement(httpSecuritySessionManagementConfigurer -> {
                    httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.NEVER);
                })
                .csrf(httpSecurityCsrfConfigurer -> {
                    httpSecurityCsrfConfigurer.disable();
                })
                // 마이페이지, 예약 처리, 결제 처리, 어드민 페이지 같은 로그인이 필요한 경우 추가
                .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> {
                    authorizationManagerRequestMatcherRegistry
                            .requestMatchers("/user/logout", "/user/profile", "/user/password/**").authenticated()
                            .anyRequest()
                            .permitAll();
                })
                .userDetailsService(customUserDetailsService)
                .formLogin(httpSecurityFormLoginConfigurer -> {
                    httpSecurityFormLoginConfigurer
                            .loginPage("/user/login")
                            .usernameParameter("username")
                            .passwordParameter("password")
                            .successHandler(loginSuccessHandler)
                            .failureHandler(new LoginFailureHandler());
                })
                .oauth2Login(httpSecurityOAuth2LoginConfigurer -> {
                    httpSecurityOAuth2LoginConfigurer
                            .loginPage("/user/login")
                            .userInfoEndpoint(userInfoEndpointConfig -> {
                                userInfoEndpointConfig.userService(customOAuth2UserService);
                            })
                            .successHandler(oAuth2LoginSuccessHandler);
                })
                .logout(httpSecurityLogoutConfigurer -> {
                    httpSecurityLogoutConfigurer
                            .logoutUrl("/user/logout")
                            .addLogoutHandler(customLogoutHandler)
                            .logoutSuccessHandler((request, response, authentication) -> {
                                Gson gson = new Gson();
                                String jsonStr = gson.toJson(Map.of("success", true));
                                response.setContentType("application/json;charset=utf-8");
                                PrintWriter pw = response.getWriter();
                                pw.println(jsonStr);
                                pw.close();
                            });
                })
                .cors(httpSecurityCorsConfigurer -> {
                    httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
                })
                .exceptionHandling(httpSecurityExceptionHandlingConfigurer -> {
                    httpSecurityExceptionHandlingConfigurer
                            .accessDeniedHandler(new CustomAccessDeniedHandler());
                })
                .addFilterBefore(jwtFilter, LogoutFilter.class).build();
    }
}
