package com.example.skip.annotation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public interface PhoneValid {
    @NotBlank(message = "전화번호를 입력해주세요.")
    @Size(min = 12, max = 13, message = "10~11자리 번호를 입력해주세요.")
    @Pattern(regexp = "^01[016789]-\\d{3,4}-\\d{4}$", message = "숫자만 입력해주세요.")
    String getPhone();
}
