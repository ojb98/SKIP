package com.example.skip.controller;

import com.example.skip.dto.SignupRequestDto;
import com.example.skip.dto.UserDto;
import com.example.skip.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;


    @PostMapping
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequestDto signupRequestDto,
                                          BindingResult bindingResult) {
        if (!signupRequestDto.getUsername().isEmpty()) {
            userService.signup(signupRequestDto, bindingResult);
        }

        if (bindingResult.hasErrors()) {
            Map<String, Object> fieldErrors = new HashMap<>();

            for (FieldError fieldError: bindingResult.getFieldErrors()) {
                fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ResponseEntity.badRequest().body(fieldErrors);
        }

        return ResponseEntity.ok(true);
    }

    @GetMapping("/find/{username}")
    public boolean isUser(@PathVariable("username") String username) {
        return userService.isUser(username);
    }
}
