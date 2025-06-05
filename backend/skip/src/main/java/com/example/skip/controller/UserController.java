package com.example.skip.controller;

import com.example.skip.dto.*;
import com.example.skip.dto.request.AccountDeleteRequestDto;
import com.example.skip.dto.request.PasswordChangeRequestDto;
import com.example.skip.dto.request.PasswordSetRequestDto;
import com.example.skip.dto.request.SignupRequestDto;
import com.example.skip.dto.response.ApiResponseDto;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.exception.CustomEmailException;
import com.example.skip.service.EmailVerifyService;
import com.example.skip.service.UserService;
import com.example.skip.service.UserSocialService;
import com.example.skip.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private final EmailVerifyService emailVerifyService;

    private final UserSocialService userSocialService;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;


    @PostMapping
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequestDto signupRequestDto,
                                    BindingResult bindingResult) {
        if (userService.isUser(signupRequestDto.getUsername())) {
            bindingResult.rejectValue("username", null, "이미 가입된 아이디입니다.");
        }

        if (!signupRequestDto.isVerified()) {
            bindingResult.rejectValue("email", null, "이메일을 인증해주세요.");
        }

        if (!bindingResult.hasErrors()) {
            userService.signup(signupRequestDto, bindingResult);
        } else {
            Map<String, Object> fieldErrors = new HashMap<>();

            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ResponseEntity.badRequest().body(fieldErrors);
        }

        return ResponseEntity.ok(true);
    }

    @PostMapping("/email/verify")
    public ApiResponseDto verifyEmail(@RequestParam("email") String email) {
        emailVerifyService.sendVerificationCode(email);

        return new ApiResponseDto(true, email);
    }

    @ExceptionHandler(CustomEmailException.class)
    public ApiResponseDto emailError(CustomEmailException e) {
        if (e.getMessage().equals("Invalid Email")) {
            return new ApiResponseDto(false, "존재하지 않는 이메일입니다.");
        }
        return new ApiResponseDto(false, "인증번호를 재전송해주세요.");
    }

    @PostMapping("/email/confirm")
    public ApiResponseDto confirmCode(@RequestParam("email") String email,
                                      @RequestParam("verificationCode") String verificationCode) {
        if (emailVerifyService.confirmVerificationCode(email, verificationCode)) {
            return new ApiResponseDto(true, email);
        }
        return new ApiResponseDto(false, "잘못된 인증번호입니다.");
    }

    @GetMapping("/find/{username}")
    public boolean isUser(@PathVariable("username") String username) {
        return userService.isUser(username);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = (UserDto) userDetails;
        Map<String, Object> claims = userDto.getClaims();
        return ResponseEntity.ok(Map.of("success", true, "return", claims));
    }

    @PutMapping("/password/change")
    public ApiResponseDto changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                         @Valid @RequestBody PasswordChangeRequestDto passwordChangeRequestDto,
                                         BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;
        boolean result = false;
        if (!bindingResult.hasErrors()) {
            result = userService.changePassword(userDto, passwordChangeRequestDto, bindingResult);
        }

        Map<String, Object> fieldErrors = new HashMap<>();
        for (FieldError fieldError: bindingResult.getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ApiResponseDto.builder()
                .success(result)
                .data(fieldErrors).build();
    }

    @PutMapping("/password/set")
    public ApiResponseDto setPassword(@AuthenticationPrincipal UserDetails userDetails,
                                      @Valid @RequestBody PasswordSetRequestDto passwordSetRequestDto,
                                      BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;
        boolean result = false;

        String password = passwordSetRequestDto.getPassword();
        if (!password.equals(passwordSetRequestDto.getConfirmPassword())) {
            bindingResult.rejectValue("confirmPassword", null, "비밀번호 확인이 일치하지 않습니다.");
        }

        if (!bindingResult.hasErrors()) {
            result = userService.setPassword(userDto, password);
        } else {
            Map<String, Object> fieldErrors = new HashMap<>();
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ApiResponseDto.builder()
                    .success(false)
                    .data(fieldErrors).build();
        }

        return ApiResponseDto.builder()
                .success(result)
                .data(null).build();
    }

    @DeleteMapping("/delete")
    public ApiResponseDto deleteAccount(@AuthenticationPrincipal UserDetails userDetails,
                                        @Valid @RequestBody AccountDeleteRequestDto accountDeleteRequestDto,
                                        BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;
        System.out.println(accountDeleteRequestDto);

        Boolean isPassword = accountDeleteRequestDto.getIsPassword();

        if (isPassword && !passwordEncoder.matches(accountDeleteRequestDto.getPassword(), userDto.getPassword())) {
            bindingResult.rejectValue("password", null, "비밀번호가 일치하지 않습니다.");
        }

        if (!isPassword) {
            if (!accountDeleteRequestDto.getEmail().equals(userDto.getEmail())) {
                bindingResult.rejectValue("email", null, "이메일이 일치하지 않습니다.");
            }
            if (!accountDeleteRequestDto.getIsVerified()) {
                bindingResult.rejectValue("email", null, "이메일을 인증해주세요.");
            }
        }

        if (!bindingResult.hasErrors()) {
            try {
                userService.deleteAccount(userDto);
                return ApiResponseDto.builder()
                        .success(true).build();
            } catch (Exception e) {
                return ApiResponseDto.builder()
                        .success(false)
                        .data(e.getMessage()).build();
            }
        } else {
            Map<String, String> fieldErrors = new HashMap<>();
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ApiResponseDto.builder()
                    .success(false)
                    .data(fieldErrors).build();
        }
    }
}
