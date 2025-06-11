package com.example.skip.service;

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
import com.example.skip.util.RandomStringGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    private final UserSocialService userSocialService;

    private final NaverLinkageRepository naverLinkageRepository;

    private final KakaoLinkageRepository kakaoLinkageRepository;

    private final PasswordEncoder passwordEncoder;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String clientName = userRequest.getClientRegistration().getClientName();
        String password = passwordEncoder.encode(RandomStringGenerator.generate(12, RandomStringGenerator.ALPHANUMERIC));

        if (clientName.equals("Naver")) {
            // 네이버 로그인

            NaverProfileDto naverProfileDto = new NaverProfileDto(attributes);

            Optional<User> optionalUser = userRepository.findUserByNaverLinkageNaverId(naverProfileDto.getNaverId());

            UserDto userDto = optionalUser.isEmpty() ? userSocialService.signupWithNaver(null, naverProfileDto) : new UserDto(optionalUser.get());
            userDto.setAttributes(attributes);
            return userDto;

        } else if (clientName.equals("Kakao")) {
            // 카카오 로그인

            KakaoProfileDto kakaoProfileDto = new KakaoProfileDto(attributes);

            Optional<User> optionalUser = userRepository.findUserByKakaoLinkageKakaoId(kakaoProfileDto.getKakaoId());

            UserDto userDto = optionalUser.isEmpty() ? userSocialService.signupWithKakao(null, kakaoProfileDto) : new UserDto(optionalUser.get());

            userDto.setAttributes(attributes);
            return userDto;
        }
        throw new OAuth2AuthenticationException("Unsupported Provider");
    }
}
