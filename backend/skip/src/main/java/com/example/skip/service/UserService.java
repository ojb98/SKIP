package com.example.skip.service;

import com.example.skip.dto.SignupRequestDto;
import com.example.skip.dto.UserDto;
import com.example.skip.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    public UserDto signup(SignupRequestDto signupRequestDto, BindingResult bindingResult) {
        if (isUser(signupRequestDto.getUsername())) {
            bindingResult.rejectValue("username", null, "이미 가입된 아이디입니다.");
            return null;
        }

        UserDto userDto = signupRequestDto.toUserDto();
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        return new UserDto(userRepository.saveAndFlush(userDto.toEntity()));
    }

    public boolean isUser(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}
