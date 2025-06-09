package com.example.skip.annotation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public interface NameValid {
    @NotBlank(message = "이름을 입력해주세요.")
    @Pattern(regexp = "^[가-힣a-zA-Z]{2,15}$", message = "2~15자의 영문 혹은 한글로 입력해주세요.")
    String getName();
}
