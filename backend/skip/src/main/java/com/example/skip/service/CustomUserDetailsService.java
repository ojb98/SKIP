package com.example.skip.service;

import com.example.skip.dto.UserDto;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserRole;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.getUserWithRolesByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("아이디 또는 비밀번호가 틀렸습니다.");
        } else if (user.getStatus() == UserStatus.WITHDRAWN) {
            throw new RuntimeException("이미 탈퇴된 계정입니다.");
        } else if (user.getStatus() == UserStatus.PENDING) {
            throw new RuntimeException("승인되지 않은 사용자입니다.");
        }
        return new UserDto(user);
    }
}
