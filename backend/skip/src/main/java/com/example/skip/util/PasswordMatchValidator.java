package com.example.skip.util;

import com.example.skip.annotation.PasswordMatch;
import com.example.skip.dto.request.SignupRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, SignupRequestDto> {
    @Override
    public boolean isValid(SignupRequestDto signupRequestDto, ConstraintValidatorContext constraintValidatorContext) {
        if (signupRequestDto.getPassword() == null || signupRequestDto.getConfirmPassword() == null) {
            return false;
        }
        boolean isValid = signupRequestDto.getPassword().equals(signupRequestDto.getConfirmPassword());

        if (!isValid) {
            constraintValidatorContext.disableDefaultConstraintViolation();

            constraintValidatorContext.buildConstraintViolationWithTemplate(constraintValidatorContext.getDefaultConstraintMessageTemplate())
                    .addPropertyNode("confirmPassword")
                    .addConstraintViolation();
        }

        return isValid;
    }
}
