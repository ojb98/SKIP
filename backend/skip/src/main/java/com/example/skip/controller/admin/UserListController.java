package com.example.skip.controller.admin;

import com.example.skip.entity.User;
import com.example.skip.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserListController {

    private final UserRepository userRepository;

    // ✅ 전체 유저 목록 반환
    @GetMapping
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // ✅ 단일 유저 조회 (예: /api/users/1)
    @GetMapping("/{id}")
    public User findUserById(@PathVariable("id") Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. ID=" + id));
    }
}
