package com.example.skip.annotation;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public interface EmailValid {
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "이메일 형식이 올바르지 않습니다.", regexp = "^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,10}$")
    String getEmail();
}
