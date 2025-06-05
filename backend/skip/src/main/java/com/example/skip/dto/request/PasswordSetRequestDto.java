package com.example.skip.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PasswordSetRequestDto {
    @NotBlank(message = "비밀번호를 입력해주세요.")
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
}
