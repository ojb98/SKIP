package com.example.skip.service;

import com.example.skip.dto.PasswordChangeRequestDto;
import com.example.skip.dto.SignupRequestDto;
import com.example.skip.dto.UserDto;
import com.example.skip.entity.User;
import com.example.skip.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

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

        if (!signupRequestDto.isVerified()) {
            bindingResult.rejectValue("email", null, "이메일을 인증해주세요.");
            return null;
        }

        UserDto userDto = signupRequestDto.toUserDto();
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        return new UserDto(userRepository.saveAndFlush(userDto.toEntity()));
    }

    public boolean isUser(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean changePassword(UserDto userDto, PasswordChangeRequestDto passwordChangeRequestDto, BindingResult bindingResult) {
        String inputPassword = passwordChangeRequestDto.getCurrentPassword();
        if (passwordEncoder.matches(inputPassword, userDto.getPassword())) {
            String newPassword = passwordChangeRequestDto.getNewPassword();
            if (newPassword.equals(passwordChangeRequestDto.getConfirmNewPassword())) {
                User user = userDto.toEntity();
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.saveAndFlush(user);
                return true;
            }

            bindingResult.rejectValue("confirmNewPassword", null, "비밀번호 확인이 일치하지 않습니다.");
            return false;
        }

        bindingResult.rejectValue("currentPassword", null, "현재 비밀번호가 일치하지 않습니다.");
        return false;
    }
}
