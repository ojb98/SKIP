package com.example.skip.service;

import com.example.skip.dto.request.PasswordChangeRequest;
import com.example.skip.dto.request.SignupRequest;
import com.example.skip.dto.UserDto;
import com.example.skip.entity.QKakaoLinkage;
import com.example.skip.entity.QNaverLinkage;
import com.example.skip.entity.QUser;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.repository.KakaoLinkageRepository;
import com.example.skip.repository.NaverLinkageRepository;
import com.example.skip.repository.UserRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    private final KakaoLinkageRepository kakaoLinkageRepository;

    private final NaverLinkageRepository naverLinkageRepository;

    private final PasswordEncoder passwordEncoder;

    private final JPAQueryFactory jpaQueryFactory;

    private static final QUser user = QUser.user;

    private static final QNaverLinkage naverLinkage = QNaverLinkage.naverLinkage;

    private static final QKakaoLinkage kakaoLinkage = QKakaoLinkage.kakaoLinkage;


    public UserDto signup(SignupRequest signupRequest, BindingResult bindingResult) {
//        if (isUser(signupRequestDto.getUsername())) {
//            bindingResult.rejectValue("username", null, "이미 가입된 아이디입니다.");
//            return null;
//        }
//
//        if (!signupRequestDto.isVerified()) {
//            bindingResult.rejectValue("email", null, "이메일을 인증해주세요.");
//            return null;
//        }

        UserDto userDto = signupRequest.toUserDto();
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        return new UserDto(userRepository.saveAndFlush(userDto.toEntity()));
    }

    public boolean isUser(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    @Cacheable(value = "users", key = "#userId", unless = "#result == null")
    public UserDto getUser(Long userId) {
        return new UserDto(userRepository.findByUserId(userId).orElseThrow());
    }

    @CacheEvict(value = "users", key = "#userId")
    public void changeImage(Long userId, String image) {
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setImage(image);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void changeNickname(Long userId, String nickname) throws DataIntegrityViolationException {
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setNickname(nickname);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void changeUsername(Long userId, String username) throws DataIntegrityViolationException {
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setUsername(username);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void changeEmail(Long userId, String email) {
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setEmail(email);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void changeName(Long userId, String name) {
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setName(name);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void changePhone(Long userId, String phone) {
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setPhone(phone);
    }

    @CacheEvict(value = "users", key = "#userDto.userId")
    public boolean changePassword(UserDto userDto, PasswordChangeRequest passwordChangeRequest, BindingResult bindingResult) {
        String inputPassword = passwordChangeRequest.getCurrentPassword();
        if (passwordEncoder.matches(inputPassword, userDto.getPassword())) {
            String newPassword = passwordChangeRequest.getNewPassword();
            if (newPassword.equals(passwordChangeRequest.getConfirmNewPassword())) {
                User user = userRepository.findByUserId(userDto.getUserId()).orElseThrow();
                user.setPassword(passwordEncoder.encode(newPassword));
                return true;
            }

            bindingResult.rejectValue("confirmNewPassword", null, "비밀번호 확인이 일치하지 않습니다.");
            return false;
        }

        bindingResult.rejectValue("currentPassword", null, "현재 비밀번호가 일치하지 않습니다.");
        return false;
    }

    @CacheEvict(value = "users", key = "#userDto.userId")
    public boolean setPassword(UserDto userDto, String password) {
        Long userId = userDto.getUserId();
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setPassword(passwordEncoder.encode(password));

        long affected = 0;
        if (user.getSocial() == UserSocial.NAVER) {
            affected = jpaQueryFactory
                    .update(naverLinkage)
                    .set(naverLinkage.passwordSet, true)
                    .where(naverLinkage.user.userId.eq(userId))
                    .execute();
        } else if (user.getSocial() == UserSocial.KAKAO) {
            affected = jpaQueryFactory
                    .update(kakaoLinkage)
                    .set(kakaoLinkage.passwordSet, true)
                    .where(kakaoLinkage.user.userId.eq(userId))
                    .execute();
        }

        if (affected > 0) {
            return true;
        }

        return false;
    }

    @CacheEvict(value = "users", key = "#userDto.userId")
    public void deleteAccount(UserDto userDto) {
        User user = userRepository.findByUserId(userDto.getUserId()).orElseThrow();
        user.setStatus(UserStatus.WITHDRAWN);
        user.setUsername(user.getUsername() + "_deleted_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
        if (user.getSocial() == UserSocial.KAKAO) {
            user.getKakaoLinkage().setKakaoId(user.getKakaoLinkage().getKakaoId() + "_deleted_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
        } else if (user.getSocial() == UserSocial.NAVER) {
            user.getNaverLinkage().setNaverId(user.getNaverLinkage().getNaverId() + "_deleted_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
        }
    }
}
