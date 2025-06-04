package com.example.skip.service;

import com.example.skip.dto.UserDto;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
@RequiredArgsConstructor
public class UserSocialService {
    private final UserRepository userRepository;

    private final RestTemplate restTemplate;

    private final OAuth2AuthorizedClientService oAuth2AuthorizedClientService;

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverClientSecret;


    @CacheEvict(value = "users", key = "#userDto.userId")
    public void link(UserSocial client, UserDto userDto) throws OAuth2AuthenticationException {
        String authorizationCode = requestAuthorizationCode(client);
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
    }

    public String requestAuthorizationCode(UserSocial userSocial) {
        if (userSocial == UserSocial.KAKAO) {

        } else if (userSocial == UserSocial.NAVER) {

        }

        throw new OAuth2AuthenticationException("Unsupported Provider");
    }

    public String requestAccessToken(String authorizationCode) {
        return null;
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
            params.add("client_id", naverClientId);
            params.add("client_secret", naverClientSecret);
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

    public String getAccessToken(OAuth2AuthenticationToken oAuth2AuthenticationToken) {
        OAuth2AuthorizedClient oAuth2AuthorizedClient = oAuth2AuthorizedClientService.loadAuthorizedClient(
                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId(),
                oAuth2AuthenticationToken.getName()
        );
        return oAuth2AuthorizedClient.getAccessToken().getTokenValue();
    }
}
