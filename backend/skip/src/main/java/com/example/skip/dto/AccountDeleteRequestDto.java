package com.example.skip.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AccountDeleteRequestDto {
    private Boolean isPassword;

    private String password;

    private String email;

    private Boolean isVerified;

    @NotBlank(message = "확인값을 입력해주세요.")
    @Pattern(regexp = "^delete$", message = "확인값이 일치하지 않습니다.")
    private String confirm;
}
