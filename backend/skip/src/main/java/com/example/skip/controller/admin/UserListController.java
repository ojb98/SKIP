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


    @GetMapping("/find-user-by-name/{name}")
    public List<User> findUserByName(@PathVariable("name") String name) {
        return userRepository.findByNameContaining(name);
    }

    @GetMapping("/find-user-by-username/{username}")
    public List<User> findUsersByUsername(@PathVariable("username") String username) {
        return userRepository.findByUsernameContaining(username);
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
