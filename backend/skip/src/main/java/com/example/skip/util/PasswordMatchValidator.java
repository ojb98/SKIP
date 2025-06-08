package com.example.skip.util;

import com.example.skip.annotation.PasswordMatch;
import com.example.skip.dto.request.SignupRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, SignupRequest> {
    @Override
    public boolean isValid(SignupRequest signupRequest, ConstraintValidatorContext constraintValidatorContext) {
        if (signupRequest.getPassword() == null || signupRequest.getConfirmPassword() == null) {
            return false;
        }
        boolean isValid = signupRequest.getPassword().equals(signupRequest.getConfirmPassword());

        if (!isValid) {
            constraintValidatorContext.disableDefaultConstraintViolation();

            constraintValidatorContext.buildConstraintViolationWithTemplate(constraintValidatorContext.getDefaultConstraintMessageTemplate())
                    .addPropertyNode("confirmPassword")
                    .addConstraintViolation();
        }

        return isValid;
    }
}
