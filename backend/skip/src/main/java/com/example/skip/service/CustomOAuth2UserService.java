package com.example.skip.service;

import com.example.skip.dto.UserDto;
import com.example.skip.entity.NaverLinkage;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserRole;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
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
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String clientName = userRequest.getClientRegistration().getClientName();
        String password = passwordEncoder.encode(RandomStringGenerator.generate(12, RandomStringGenerator.ALPHANUMERIC));

        if (clientName.equals("Naver")) {
            // 네이버 로그인
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            String naverId = (String) response.get("id");
            String username = clientName + "_" + naverId;

            User user = userRepository.getUserWithRolesByUsername(username);
            if (user == null) {
                String email = (String) response.get("email");
                String name = (String) response.get("name");
                String mobile = (String) response.get("mobile");
                String profile_image = (String) response.get("profile_image");

                user = User.builder()
                        .userId(null)
                        .username(username)
                        .password(password)
                        .email(email)
                        .name(name)
                        .phone(mobile)
//                        .image()
                        .status(UserStatus.APPROVED)
                        .roles(Set.of(UserRole.USER))
                        .social(UserSocial.NAVER).build();
                userRepository.saveAndFlush(user);

                NaverLinkage naverLinkage = NaverLinkage.builder()
                        .naverId(naverId)
                        .usernameSet(false)
                        .passwordSet(false).build();
            }
            UserDto userDto = new UserDto(user);
            userDto.setAttributes(attributes);
            return userDto;
        } else if (clientName.equals("Kakao")) {
            // 카카오 로그인
            String username = clientName + "_" + attributes.get("id");

            User user = userRepository.getUserWithRolesByUsername(username);
            if (user == null) {
                Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
                String email = (String) ((Map<String, Object>) attributes.get("kakao_account")).get("email");
                user = User.builder()
                        .userId(null)
                        .username(username)
                        .password(password)
                        .email(email)
//                        .image()
                        .status(UserStatus.APPROVED)
                        .roles(Set.of(UserRole.USER))
                        .social(UserSocial.KAKAO).build();
                userRepository.saveAndFlush(user);
            }
            UserDto userDto = new UserDto(user);
            userDto.setAttributes(attributes);
            return userDto;
        }
        throw new OAuth2AuthenticationException("Unsupported Provider");
    }
}
