package com.example.skip.dto.request;

import com.example.skip.annotation.PasswordMatch;
import com.example.skip.dto.UserDto;
import com.example.skip.enumeration.UserRole;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Set;

@Data
@PasswordMatch
public class SignupRequest {
    @NotBlank(message = "아이디를 입력해주세요.")
    @Pattern(message = "5~15자의 영문 또는 숫자로 입력해주세요.", regexp = "^[a-zA-Z0-9]{5,15}$")
    private String username;

    @Pattern(message = "영문 대소문자, 숫자, 특수문자 중 2가지 조합 8자리 이상으로 작성해주세요.", regexp =
            "^(?=(" +
            "(?:.*[a-z])(?:.*[A-Z])|" +
            "(?:.*[a-z])(?:.*\\d)|" +
            "(?:.*[a-z])(?:.*[^a-zA-Z0-9])|" +
            "(?:.*[A-Z])(?:.*[a-z])|" +
            "(?:.*[A-Z])(?:.*\\d)|" +
            "(?:.*[A-Z])(?:.*[^a-zA-Z0-9])|" +
            "(?:.*\\d)(?:.*[a-z])|" +
            "(?:.*\\d)(?:.*[A-Z])|" +
            "(?:.*\\d)(?:.*[^a-zA-Z0-9])|" +
            "(?:.*[^a-zA-Z0-9])(?:.*[a-z])|" +
            "(?:.*[^a-zA-Z0-9])(?:.*[A-Z])|" +
            "(?:.*[^a-zA-Z0-9])(?:.*\\d)" +
            "))" +
            "[a-zA-Z0-9!@#$%^&*()_+=-]{8,}$")
    private String password;

    @NotBlank(message = "비밀번호를 확인해주세요.")
    private String confirmPassword;

    private String name;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "이메일 형식이 올바르지 않습니다.", regexp = "^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,10}$")
    private String email;

    private boolean isVerified;

    private String phone;


    public UserDto toUserDto() {
        return new UserDto(null, username, password, name, email, phone,
                UserSocial.NONE, Set.of(UserRole.USER.name()), UserStatus.APPROVED, null, null, name);
    }
}
