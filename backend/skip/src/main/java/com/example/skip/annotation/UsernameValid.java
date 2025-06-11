package com.example.skip.annotation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public interface UsernameValid {
    @NotBlank(message = "아이디를 입력해주세요.")
    @Pattern(message = "5~15자의 영문 또는 숫자로 입력해주세요.", regexp = "^[a-zA-Z0-9]{5,15}$")
    String getUsername();
}
