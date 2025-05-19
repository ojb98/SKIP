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

public class UserDto extends User {
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


    public UserDto(Long userId, String username, String password, String name, String email, String phone,
                   UserSocial social, Set<String> roles, UserStatus status, LocalDateTime registeredAt) {
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
    }
}
