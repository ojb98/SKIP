package com.example.skip.annotation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public interface NicknameValid {
    @Size(min = 5, max = 15, message = "닉네임은 5~15자여야 합니다.")
    @NotBlank(message = "닉네임을 입력해주세요.")
    @Pattern(regexp = "^[a-zA-z0-9가-힣]*$", message = "한글, 영어, 숫자를 조합해서 지어주세요.")
    String getNickname();
}
