package com.example.skip.service;

import com.example.skip.config.properties.OAuth2Properties;
import com.example.skip.dto.KakaoProfileDto;
import com.example.skip.dto.NaverProfileDto;
import com.example.skip.dto.UserDto;
import com.example.skip.entity.KakaoLinkage;
import com.example.skip.entity.NaverLinkage;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserRole;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.repository.KakaoLinkageRepository;
import com.example.skip.repository.NaverLinkageRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.util.FileUploadUtil;
import com.example.skip.util.RandomStringGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserSocialService {
    private final UserRepository userRepository;

    private final KakaoLinkageRepository kakaoLinkageRepository;

    private final NaverLinkageRepository naverLinkageRepository;

    private final RestTemplate restTemplate;

    private final OAuth2AuthorizedClientService oAuth2AuthorizedClientService;

    private final ClientRegistrationRepository clientRegistrationRepository;

    private final PasswordEncoder passwordEncoder;

    private final OAuth2Properties oAuth2Properties;

    private final FileUploadUtil fileUploadUtil;

    @Value("${spring.security.oauth2.client.custom-kakao.redirect-uri}")
    private String customKakaoRedirectUri;

    @Value("${spring.security.oauth2.client.custom-naver.redirect-uri}")
    private String customNaverRedirectUri;

    @Value("${file.profile-image}")
    private String profileImagePath;


    public UserDto signupWithKakao(Long userId, KakaoProfileDto kakaoProfileDto) throws DataIntegrityViolationException {
        User user;
        MultipartFile file = fileUploadUtil.fetchImageAsMultipart(kakaoProfileDto.getProfileImageUrl());
        boolean isUser = userId != null;

        // userId가 null일 경우 신규 가입
        if (isUser) {
            user = userRepository.findByUserId(userId).orElseThrow();

            String image = fileUploadUtil.uploadFileAndUpdateUrl(file, user.getImage(), profileImagePath);

            user.setEmail(kakaoProfileDto.getEmail());
            user.setImage(image);
            user.setSocial(UserSocial.KAKAO);

        } else {
            String password = passwordEncoder.encode(RandomStringGenerator.generate(12, RandomStringGenerator.ALPHANUMERIC));
            String image = fileUploadUtil.uploadFileAndUpdateUrl(file, null, profileImagePath);

            user = User.builder()
                    .username(kakaoProfileDto.getUsername())
                    .password(password)
                    .email(kakaoProfileDto.getEmail())
                    .image(image)
                    .status(UserStatus.APPROVED)
                    .roles(Set.of(UserRole.USER))
                    .social(UserSocial.KAKAO).build();
        }

        userRepository.saveAndFlush(user);

        KakaoLinkage kakaoLinkage = KakaoLinkage.builder()
                .user(user)
                .kakaoId(kakaoProfileDto.getKakaoId().toString())
                .usernameSet(isUser)
                .passwordSet(isUser)
                .nameSet(isUser)
                .phoneSet(isUser).build();

        kakaoLinkageRepository.saveAndFlush(kakaoLinkage);

        user.setKakaoLinkage(kakaoLinkage);

        return new UserDto(user);
    }

    public UserDto signupWithNaver(Long userId, NaverProfileDto naverProfileDto) throws DataIntegrityViolationException {
        User user;
        MultipartFile file = fileUploadUtil.fetchImageAsMultipart(naverProfileDto.getProfileImage());
        boolean isUser = userId != null;

        if (isUser) {
            user = userRepository.findByUserId(userId).orElseThrow();

            String image = fileUploadUtil.uploadFileAndUpdateUrl(file, user.getImage(), profileImagePath);

            user.setEmail(naverProfileDto.getEmail());
            user.setName(naverProfileDto.getName());
            user.setPhone(naverProfileDto.getMobile());
            user.setImage(image);
            user.setSocial(UserSocial.NAVER);

        } else {
            String password = passwordEncoder.encode(RandomStringGenerator.generate(12, RandomStringGenerator.ALPHANUMERIC));
            String image = fileUploadUtil.uploadFileAndUpdateUrl(file, null, profileImagePath);

            user = User.builder()
                    .username(naverProfileDto.getUsername())
                    .password(password)
                    .email(naverProfileDto.getEmail())
                    .name(naverProfileDto.getName())
                    .phone(naverProfileDto.getMobile())
                    .image(image)
                    .status(UserStatus.APPROVED)
                    .roles(Set.of(UserRole.USER))
                    .social(UserSocial.NAVER).build();
        }

        userRepository.saveAndFlush(user);

        NaverLinkage naverLinkage = NaverLinkage.builder()
                .user(user)
                .naverId(naverProfileDto.getNaverId())
                .usernameSet(isUser)
                .passwordSet(isUser).build();

        naverLinkageRepository.saveAndFlush(naverLinkage);

        user.setNaverLinkage(naverLinkage);

        return new UserDto(user);
    }

    @CacheEvict(value = "users", key = "#userDto.userId")
    public void link(UserSocial client, String authorizationCode, UserDto userDto) throws OAuth2AuthenticationException, DataIntegrityViolationException {
        Map<String, Object> body = requestAccessToken(client, authorizationCode);
        log.info("Access token response: {}", body);

        String accessToken = (String) body.get("access_token");
        String refreshToken = (String) body.get("refresh_token");
        Integer expiresIn = (Integer) body.get("expires_in");
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plusSeconds(expiresIn);

        Map<String, Object> attributes = requestAttributes(client, accessToken);

        if (client == UserSocial.KAKAO) {
            signupWithKakao(userDto.getUserId(), new KakaoProfileDto(attributes));
        } else if (client == UserSocial.NAVER) {
            signupWithNaver(userDto.getUserId(), new NaverProfileDto(attributes));
        }

        OAuth2AccessToken oAuth2AccessToken = new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER, accessToken, issuedAt, expiresAt);
        OAuth2RefreshToken oAuth2RefreshToken = new OAuth2RefreshToken(refreshToken, issuedAt);

        OAuth2AuthorizedClient oAuth2AuthorizedClient = new OAuth2AuthorizedClient(
                clientRegistrationRepository.findByRegistrationId(client.name().toLowerCase()),
                userDto.getUsername(),
                oAuth2AccessToken,
                oAuth2RefreshToken
        );

        oAuth2AuthorizedClientService.saveAuthorizedClient(oAuth2AuthorizedClient, new Authentication() {
            @Override
            public Collection<? extends GrantedAuthority> getAuthorities() {
                return List.of();
            }

            @Override
            public Object getCredentials() {
                return null;
            }

            @Override
            public Object getDetails() {
                return null;
            }

            @Override
            public Object getPrincipal() {
                return null;
            }

            @Override
            public boolean isAuthenticated() {
                return false;
            }

            @Override
            public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {

            }

            @Override
            public String getName() {
                return userDto.getUsername();
            }
        });
    }

    // 소셜 로그인 인가 코드 요청
    public String getAuthorizationUrl(UserSocial client) {
        if (client == UserSocial.KAKAO) {
            String scope = String.join(",", oAuth2Properties.getKakao().getScope());

            return "https://kauth.kakao.com/oauth/authorize?client_id=" + oAuth2Properties.getKakao().getClientId()
                    + "&redirect_uri=" + URLEncoder.encode(customKakaoRedirectUri, StandardCharsets.UTF_8)
                    + "&response_type=code"
                    + "&scope=" + scope;

        } else if (client == UserSocial.NAVER) {
            return "https://nid.naver.com/oauth2.0/authorize?client_id=" + oAuth2Properties.getNaver().getClientId()
                    + "&redirect_uri=" + URLEncoder.encode(customNaverRedirectUri, StandardCharsets.UTF_8)
                    + "&response_type=code";
        }

        throw new OAuth2AuthenticationException("Unsupported Provider");
    }

    // 소셜 로그인 접근 토큰 요청
    public Map<String, Object> requestAccessToken(UserSocial client, String authorizationCode) {
        if (client == UserSocial.KAKAO) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("redirect_uri", "http://localhost:8080/user/social/link/kakao");
            params.add("client_id", oAuth2Properties.getKakao().getClientId());
            params.add("client_secret", oAuth2Properties.getKakao().getClientSecret());
            params.add("code", authorizationCode);

            HttpEntity<?> request = new HttpEntity<>(params, httpHeaders);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://kauth.kakao.com/oauth/token",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return response.getBody();

        } else if (client == UserSocial.NAVER) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", oAuth2Properties.getNaver().getClientId());
            params.add("client_secret", oAuth2Properties.getNaver().getClientSecret());
            params.add("code", authorizationCode);

            HttpEntity<?> request = new HttpEntity<>(params, httpHeaders);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://nid.naver.com/oauth2.0/token",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            Map<String, Object> body = response.getBody();

            body.put("expires_in", Integer.valueOf((String) body.get("expires_in")));

            return body;
        }

        throw new OAuth2AuthenticationException("Unsupported Provider");
    }

    public Map<String, Object> requestAttributes(UserSocial client, String accessToken) {
        if (client == UserSocial.KAKAO) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.set("Authorization", "Bearer " + accessToken);
            httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<?> request = new HttpEntity<>(httpHeaders);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return response.getBody();

        } else if (client == UserSocial.NAVER) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setBearerAuth(accessToken);

            HttpEntity<?> request = new HttpEntity<>(httpHeaders);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://openapi.naver.com/v1/nid/me",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return response.getBody();
        }

        throw new OAuth2AuthenticationException("Unsupported Provider");
    }

    @CacheEvict(value = "users", key = "#userDto.userId")
    public void unlink(UserDto userDto, String accessToken) {
        User user = userRepository.findByUserId(userDto.getUserId()).orElseThrow();
        UserSocial userSocial = user.getSocial();
        if (userSocial == UserSocial.KAKAO) {
            user.setKakaoLinkage(null);

            requestUnlink(UserSocial.KAKAO, accessToken);
        } else if (userSocial == UserSocial.NAVER) {
            user.setNaverLinkage(null);

            requestUnlink(UserSocial.NAVER, accessToken);
        } else {
            throw new RuntimeException("연결된 계정이 없습니다.");
        }
        user.setSocial(UserSocial.NONE);

        oAuth2AuthorizedClientService.removeAuthorizedClient(
                userDto.getSocial().name().toLowerCase(),
                userDto.getUsername()
        );
    }

    public ResponseEntity<String> requestUnlink(UserSocial userSocial, String accessToken) {
        if (userSocial == UserSocial.KAKAO) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.set("Authorization", "Bearer " + accessToken);

            HttpEntity<?> request = new HttpEntity<>(httpHeaders);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v1/user/unlink",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            return response;

        } else if (userSocial == UserSocial.NAVER) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant-type", "delete");
            params.add("service_provider", "NAVER");
            params.add("client_id", oAuth2Properties.getNaver().getClientId());
            params.add("client_secret", oAuth2Properties.getNaver().getClientSecret());
            params.add("access_token", accessToken);

            HttpEntity<?> request = new HttpEntity<>(params, httpHeaders);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://nid.naver.com/oauth2.0/token",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            return response;
        }

        throw new OAuth2AuthenticationException("Unsupported Provider");
    }

    public String getAccessToken(UserDto userDto) {
        OAuth2AuthorizedClient oAuth2AuthorizedClient = oAuth2AuthorizedClientService.loadAuthorizedClient(
                userDto.getSocial().name().toLowerCase(),
                userDto.getUsername()
        );

        return oAuth2AuthorizedClient.getAccessToken().getTokenValue();
    }
}
