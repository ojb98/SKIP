package com.example.skip.controller;

import com.example.skip.dto.*;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.exception.CustomEmailException;
import com.example.skip.service.EmailVerifyService;
import com.example.skip.service.UserService;
import com.example.skip.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.internal.constraintvalidators.bv.AssertFalseValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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

    private final JwtUtil jwtUtil;


    @PostMapping
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequestDto signupRequestDto,
                                          BindingResult bindingResult) {
        if (!signupRequestDto.getUsername().isEmpty() && !bindingResult.hasErrors()) {
            userService.signup(signupRequestDto, bindingResult);
        }

        if (bindingResult.hasErrors()) {
            Map<String, Object> fieldErrors = new HashMap<>();

            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ResponseEntity.badRequest().body(fieldErrors);
        }

        return ResponseEntity.ok(true);
    }

    @GetMapping("/find/{username}")
    public boolean isUser(@PathVariable("username") String username) {
        return userService.isUser(username);
    }

    @PostMapping("/email/verify")
    public ApiResponseDto verifyEmail(@RequestParam("email") String email) {
        emailVerifyService.sendVerificationCode(email);

        return new ApiResponseDto(true, email);
    }

    @PostMapping("/email/confirm")
    public ApiResponseDto confirmCode(@RequestParam("email") String email,
                                      @RequestParam("verificationCode") String verificationCode) {
        if (emailVerifyService.confirmVerificationCode(email, verificationCode)) {
            return new ApiResponseDto(true, email);
        }
        return new ApiResponseDto(false, "잘못된 인증번호입니다.");
    }

    @ExceptionHandler(CustomEmailException.class)
    public ApiResponseDto emailError(CustomEmailException e) {
        if (e.getMessage().equals("Invalid Email")) {
            return new ApiResponseDto(false, "존재하지 않는 이메일입니다.");
        }
        return new ApiResponseDto(false, "인증번호를 재전송해주세요.");
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
        System.out.println(passwordSetRequestDto);
        UserDto userDto = (UserDto) userDetails;
        boolean result = false;

        if (!bindingResult.hasErrors()) {
            result = userService.setPassword(userDto, passwordSetRequestDto, bindingResult);
        }

        Map<String, Object> fieldErrors = new HashMap<>();
        for (FieldError fieldError: bindingResult.getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ApiResponseDto.builder()
                .success(result)
                .data(fieldErrors).build();
    }
}
