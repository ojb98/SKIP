package com.example.skip.controller;

import com.example.skip.dto.*;
import com.example.skip.dto.request.*;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.exception.CustomEmailException;
import com.example.skip.service.EmailService;
import com.example.skip.service.UserService;
import com.example.skip.service.UserSocialService;
import com.example.skip.util.FileUploadUtil;
import com.example.skip.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private final EmailService emailService;

    private final UserSocialService userSocialService;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final FileUploadUtil fileUploadUtil;

    @Value("${file.profile-image}")
    private String profileImagePath;


    @PostMapping
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest,
                                    BindingResult bindingResult) {
        log.info("role: {}", signupRequest.getRole());
        log.info("isVerified: {}", signupRequest.isVerified());
        if (userService.isUser(signupRequest.getUsername())) {
            bindingResult.rejectValue("username", null, "이미 가입된 아이디입니다.");
        }

        if (!signupRequest.isVerified()) {
            bindingResult.rejectValue("email", null, "이메일을 인증해주세요.");
        }

        if (!bindingResult.hasErrors()) {
            userService.signup(signupRequest, bindingResult);
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
    public ApiResponse verifyEmail(@RequestParam("email") String email) {
        emailService.sendVerificationCode(email);

        return new ApiResponse(true, email);
    }

    @PostMapping("/email/compare-and-verify")
    public ApiResponse compareAndVerifyEmail(@Valid EmailCompareRequest emailCompareRequest,
                                             BindingResult bindingResult) {

        String username = emailCompareRequest.getUsername();
        String email = emailCompareRequest.getEmail();

        if (bindingResult.hasErrors()) {
            List<String> emailErrors = new ArrayList<>();
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                emailErrors.add(fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(emailErrors).build();
        }

        if (userService.compareEmail(username, email)) {
            emailService.sendVerificationCode(email);

            return new ApiResponse(true, email);
        }

        return ApiResponse.builder()
                .success(false)
                .data(List.of("이메일이 일치하지 않습니다.")).build();
    }

    @ExceptionHandler(CustomEmailException.class)
    public ApiResponse emailError(CustomEmailException e) {
        if (e.getMessage().equals("Invalid Email")) {
            return new ApiResponse(false, "존재하지 않는 이메일입니다.");
        }
        return new ApiResponse(false, "인증번호를 재전송해주세요.");
    }

    @PostMapping("/email/confirm")
    public ApiResponse confirmCode(@RequestParam("email") String email,
                                   @RequestParam("verificationCode") String verificationCode) {

        if (emailService.confirmVerificationCode(email, verificationCode)) {
            return new ApiResponse(true, email);
        }
        return new ApiResponse(false, "잘못된 인증번호입니다.");
    }

    @GetMapping("/find/{username}")
    public boolean isUser(@PathVariable("username") String username) {
        return userService.isUser(username);
    }

    @GetMapping("/find/username")
    public ApiResponse findUsername(@Valid @ModelAttribute UsernameFindRequest usernameFindRequest,
                                BindingResult bindingResult) {

        log.info("email: {}", usernameFindRequest.getEmail());
        if (bindingResult.hasErrors()) {
            List<String> emailErrors = new ArrayList<>();
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                emailErrors.add(fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(emailErrors).build();
        }

        List<String> usernames = userService.findUsers(usernameFindRequest.getEmail());

        if (usernames.size() == 0) {
            return ApiResponse.builder()
                    .success(false)
                    .data(List.of("가입된 아이디가 없습니다.")).build();
        }

        try {
            emailService.sendUsernames(usernameFindRequest.getEmail(), usernames);

            return ApiResponse.builder()
                    .success(true)
                    .data(usernameFindRequest.getEmail()).build();
        } catch (Exception e) {
            e.printStackTrace();

            return ApiResponse.builder()
                    .success(false)
                    .data(List.of("이메일 전송에 실패했습니다.")).build();
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = (UserDto) userDetails;
        Map<String, Object> claims = userDto.getClaims();
        return ResponseEntity.ok(Map.of("success", true, "return", claims));
    }

    @PutMapping("/image/change")
    public ApiResponse changeImage(@AuthenticationPrincipal UserDetails userDetails,
                                   MultipartFile file) {
        log.info("파일: {}", file);

        UserDto userDto = (UserDto) userDetails;

        String image = fileUploadUtil.uploadFileAndUpdateUrl(file, userDto.getImage(), profileImagePath);

        userService.changeImage(userDto.getUserId(), image);

        return ApiResponse.builder()
                .success(true).build();
    }

    @PutMapping("/nickname/change")
    public ApiResponse changeNickname(@AuthenticationPrincipal UserDetails userDetails,
                                      @Valid @RequestBody NicknameChangeRequest nicknameChangeRequest,
                                      BindingResult bindingResult) {
        log.info("닉네임: {}", nicknameChangeRequest.getNickname());

        List<String> nicknameErrors = new ArrayList<>();
        if (bindingResult.hasErrors()) {
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                nicknameErrors.add(fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(nicknameErrors).build();
        }

        UserDto userDto = (UserDto) userDetails;

        try {
            userService.changeNickname(userDto.getUserId(), nicknameChangeRequest.getNickname());
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .data(List.of("중복된 닉네임입니다.")).build();
        }

        return ApiResponse.builder()
                .success(true).build();
    }

    @PutMapping("/username/change")
    public ApiResponse changeUsername(@AuthenticationPrincipal UserDetails userDetails,
                                      @Valid @RequestBody UsernameChangeRequest usernameChangeRequest,
                                      BindingResult bindingResult) {
        log.info("아이디: {}", usernameChangeRequest.getUsername());

        List<String> usernameErrors = new ArrayList<>();
        if (bindingResult.hasErrors()) {
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                usernameErrors.add(fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(usernameErrors).build();
        }

        UserDto userDto = (UserDto) userDetails;

        try {
            userService.changeUsername(userDto.getUserId(), usernameChangeRequest.getUsername());
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .data(List.of("중복된 아이디입니다.")).build();
        }

        return ApiResponse.builder()
                .success(true).build();
    }

    @PutMapping("/email/change")
    public ApiResponse changeEmail(@AuthenticationPrincipal UserDetails userDetails,
                                   @RequestBody EmailChangeRequest emailChangeRequest) {
        UserDto userDto = (UserDto) userDetails;

        if (emailChangeRequest.getIsVerified() == true) {
            userService.changeEmail(userDto.getUserId(), emailChangeRequest.getEmail());

            return ApiResponse.builder()
                    .success(true).build();
        } else {
            return ApiResponse.builder()
                    .success(false)
                    .data("이메일을 인증해주세요.").build();
        }
    }

    @PutMapping("/name/change")
    public ApiResponse changeName(@AuthenticationPrincipal UserDetails userDetails,
                                  @Valid @RequestBody NameChangeRequest nameChangeRequest,
                                  BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;

        if (bindingResult.hasErrors()) {
            List<String> nameErrors = new ArrayList<>();

            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                nameErrors.add(fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(nameErrors).build();
        }

        userService.changeName(userDto.getUserId(), nameChangeRequest.getName());

        return ApiResponse.builder()
                .success(true).build();
    }

    @PutMapping("/phone/change")
    public ApiResponse changePhone(@AuthenticationPrincipal UserDetails userDetails,
                                  @Valid @RequestBody PhoneChangeRequest phoneChangeRequest,
                                  BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;

        if (bindingResult.hasErrors()) {
            List<String> phoneErrors = new ArrayList<>();

            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                phoneErrors.add(fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(phoneErrors).build();
        }

        userService.changePhone(userDto.getUserId(), phoneChangeRequest.getPhone());

        return ApiResponse.builder()
                .success(true).build();
    }

    @PutMapping("/password/change")
    public ApiResponse changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                      @Valid @RequestBody PasswordChangeRequest passwordChangeRequest,
                                      BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;
        boolean result = false;
        if (!bindingResult.hasErrors()) {
            result = userService.changePassword(userDto, passwordChangeRequest, bindingResult);
        }

        Map<String, Object> fieldErrors = new HashMap<>();
        for (FieldError fieldError: bindingResult.getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ApiResponse.builder()
                .success(result)
                .data(fieldErrors).build();
    }

    @PutMapping("/password/set")
    public ApiResponse setPassword(@AuthenticationPrincipal UserDetails userDetails,
                                   @Valid @RequestBody PasswordSetRequest passwordSetRequest,
                                   BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;

        String password = passwordSetRequest.getPassword();
        if (!password.equals(passwordSetRequest.getConfirmPassword())) {
            bindingResult.rejectValue("confirmPassword", null, "비밀번호 확인이 일치하지 않습니다.");
        }

        if (!bindingResult.hasErrors()) {
            boolean result = userService.setPassword(userDto, password);

            return ApiResponse.builder()
                    .success(result)
                    .data(null).build();
        } else {
            Map<String, Object> fieldErrors = new HashMap<>();
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(fieldErrors).build();
        }
    }

    @PutMapping("/password/reset")
    public ApiResponse resetPassword(@Valid @RequestBody PasswordResetRequest passwordResetRequest,
                                     BindingResult bindingResult) {

        String newPassword = passwordResetRequest.getNewPassword();
        String confirmNewPassword = passwordResetRequest.getConfirmNewPassword();

        if (!confirmNewPassword.isEmpty() && !confirmNewPassword.equals(newPassword)) {
            bindingResult.rejectValue("confirmNewPassword", null, "비밀번호 확인이 일치하지 않습니다.");
        }

        if (bindingResult.hasErrors()) {
            Map<String, Object> data = new HashMap<>();
            List<String> newPasswordErrors = new ArrayList<>();
            List<String> confirmNewPasswordErrors = new ArrayList<>();

            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                if (fieldError.getField().equals("newPassword")) {
                    newPasswordErrors.add(fieldError.getDefaultMessage());
                } else if (fieldError.getField().equals("confirmNewPassword")) {
                    confirmNewPasswordErrors.add(fieldError.getDefaultMessage());
                }
            }

            data.put("newPasswordErrors", newPasswordErrors);
            data.put("confirmNewPasswordErrors", confirmNewPasswordErrors);

            return ApiResponse.builder()
                    .success(false)
                    .data(data).build();
        }

        userService.resetPassword(passwordResetRequest.getUsername(), newPassword);

        return ApiResponse.builder()
                .success(true).build();
    }

    @DeleteMapping("/delete")
    public ApiResponse deleteAccount(@AuthenticationPrincipal UserDetails userDetails,
                                     @Valid @RequestBody AccountDeleteRequest accountDeleteRequest,
                                     BindingResult bindingResult) {
        UserDto userDto = (UserDto) userDetails;
        System.out.println(accountDeleteRequest);

        Boolean isPassword = accountDeleteRequest.getIsPassword();

        if (isPassword && !passwordEncoder.matches(accountDeleteRequest.getPassword(), userDto.getPassword())) {
            bindingResult.rejectValue("password", null, "비밀번호가 일치하지 않습니다.");
        }

        if (!isPassword) {
            if (!accountDeleteRequest.getEmail().equals(userDto.getEmail())) {
                bindingResult.rejectValue("email", null, "이메일이 일치하지 않습니다.");
            }
            if (!accountDeleteRequest.getIsVerified()) {
                bindingResult.rejectValue("email", null, "이메일을 인증해주세요.");
            }
        }

        if (!bindingResult.hasErrors()) {
            try {
                userService.deleteAccount(userDto);
                return ApiResponse.builder()
                        .success(true).build();
            } catch (Exception e) {
                return ApiResponse.builder()
                        .success(false)
                        .data(e.getMessage()).build();
            }
        } else {
            Map<String, String> fieldErrors = new HashMap<>();
            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ApiResponse.builder()
                    .success(false)
                    .data(fieldErrors).build();
        }
    }
}
