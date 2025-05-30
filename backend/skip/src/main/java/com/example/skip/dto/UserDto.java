package com.example.skip.dto;

import com.example.skip.enumeration.UserRole;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class UserDto extends User implements OAuth2User {
    private Long userId;

    private String username;

    private String password;

    private String name;

    private String email;

    private String phone;

    private UserSocial social;

    private Set<String> roles = new HashSet<>();

    private UserStatus status;

    private LocalDateTime registeredAt;

    private String image;

    private String nickname;

    private Map<String, Object> attributes;

    private NaverLinkageDto naverLinkageDto;

    private KakaoLinkageDto kakaoLinkageDto;


    public UserDto(Long userId, String username, String password, String name, String email, String phone,
                   UserSocial social, Set<String> roles, UserStatus status, LocalDateTime registeredAt, String image, String nickname) {
        super(username, password, roles.stream().map(SimpleGrantedAuthority::new).toList());
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.social = social;
        this.roles = roles;
        this.status = status;
        this.registeredAt = registeredAt;
        this.image = image;
        this.nickname = nickname;
    }

    public UserDto(com.example.skip.entity.User user) {
        super(user.getUsername(), user.getPassword(), user.getRoles().stream().map(UserRole::name).map(SimpleGrantedAuthority::new).toList());
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.social = user.getSocial();
        this.roles = user.getRoles().stream().map(UserRole::name).collect(Collectors.toSet());
        this.status = user.getStatus();
        this.registeredAt = user.getRegisteredAt();
        this.image = user.getImage();
        this.nickname = user.getNickname();
        if (social == UserSocial.NAVER) {
            this.naverLinkageDto = new NaverLinkageDto(user.getNaverLinkage());
        } else if (social == UserSocial.KAKAO) {
            this.kakaoLinkageDto = new KakaoLinkageDto(user.getKakaoLinkage());
        }
    }

    public com.example.skip.entity.User toEntity() {
        return com.example.skip.entity.User.builder()
                .userId(userId)
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .phone(phone)
                .social(social)
                .roles(roles.stream().map(UserRole::valueOf).collect(Collectors.toSet()))
                .status(status)
                .registeredAt(registeredAt)
                .image(image)
                .nickname(nickname).build();
    }

    public Map<String, Object> getClaims() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("email", email);
        claims.put("name", name);
        claims.put("phone", phone);
        claims.put("social", social);
        claims.put("roles", roles);
        claims.put("registeredAt", registeredAt.toString());
        claims.put("image", image);
        claims.put("nickname", nickname);
        if (social == UserSocial.NAVER) {
            claims.put("linkage", naverLinkageDto.getClaims());
        } else if (social == UserSocial.KAKAO) {
            claims.put("linkage", kakaoLinkageDto.getClaims());
        }
        System.out.println(claims);
        return claims;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }
}
