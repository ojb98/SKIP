package com.example.skip.service;

import com.example.skip.dto.UserDto;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserRole;
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
            throw new UsernameNotFoundException("Not Found");
        }
        return new UserDto(user.getUserId(),
                user.getUsername(),
                user.getPassword(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getSocial(),
                user.getRoles().stream().map(UserRole::name).collect(Collectors.toSet()),
                user.getStatus(),
                user.getRegisteredAt(),
                user.getImage());
    }
}
