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
    @GetMapping("/find-user-by-userid/{id}")
    public User findUserById(@PathVariable("id") Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. 아이디=" + id));
    }

    @GetMapping("/find-user-by-username/{id}")
    public User findUserByUsername(@PathVariable("id") String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. 이름=" + username));
    }
//
//    @GetMapping("/find-users-5reviews/{id}")
//    public List<Recent5Reviews> find5ReviewsByUserId(@PathVariable("id") Long id){
//        return userRepository.findReviewsById(id);
//    }
//
//    @GetMapping("/find-users-5purchases/{id}")
//    public List<Recent5Purchases> find5PurchasesByUserId(@PathVariable("id") Long id){
//        return userRepository.find5PurchasesById(id);
//    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") Long id){
        userRepository.deleteById(id);
    }


}
