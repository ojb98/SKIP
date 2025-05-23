package com.example.skip.dto;

import com.example.skip.enumeration.UserRole;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class UserDto extends User {
    private Long userId;

    private String username;

    private String password;

    private String name;
    private String nickname;

    private String email;

    private String phone;

    private UserSocial social;

    private Set<String> roles = new HashSet<>();

    private UserStatus status;

    private LocalDateTime registeredAt;

    private String image;


    public UserDto(Long userId, String username, String password, String name, String nickname, String email, String phone,
                   UserSocial social, Set<String> roles, UserStatus status, LocalDateTime registeredAt, String image) {
        super(username, password, roles.stream().map(SimpleGrantedAuthority::new).toList());
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.social = social;
        this.roles = roles;
        this.status = status;
        this.registeredAt = registeredAt;
        this.image = image;
    }

    public UserDto(com.example.skip.entity.User user) {
        super(user.getUsername(), user.getPassword(), user.getRoles().stream().map(UserRole::name).map(SimpleGrantedAuthority::new).toList());
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.name = user.getName();
        this.nickname = user.getNickname();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.social = user.getSocial();
        this.roles = user.getRoles().stream().map(UserRole::name).collect(Collectors.toSet());
        this.status = user.getStatus();
        this.registeredAt = user.getRegisteredAt();
        this.image = user.getImage();
    }

    public com.example.skip.entity.User toEntity() {
        return com.example.skip.entity.User.builder()
                .userId(userId)
                .username(username)
                .password(password)
                .name(name)
                .nickname(nickname)
                .email(email)
                .phone(phone)
                .social(social)
                .roles(roles.stream().map(UserRole::valueOf).collect(Collectors.toSet()))
                .status(status)
                .registeredAt(registeredAt)
                .image(image).build();
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
