package com.example.skip.controller.admin;

import com.example.skip.dto.payment.PaymentDTO;
import com.example.skip.dto.ReviewDTO;
import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.repository.PaymentRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.service.UserListService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserListController {
    private final UserRepository userRepository;
    private final UserListService userListService;

    @GetMapping
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }


    @GetMapping("/find/name/{name}")
    public List<User> findUserByName(@PathVariable("name") String name) {
        return userRepository.findByNameContaining(name);
    }

    @GetMapping("/find/username/{username}")
    public List<User> findUsersByUsername(@PathVariable("username") String username) {
        return userRepository.findByUsernameContaining(username);
    }

    @GetMapping("/find/recent/activity/{userId}")
    public ResponseEntity<Map<String, Object>> getUserActivity(@PathVariable("userId") Long userId) {
        List<ReviewDTO> recentReviews = userListService.getUserRecentReviews(userId);
        List<PaymentDTO> recentPayment = userListService.getUserRecentPayments(userId);
        Map<String, Object> result = new HashMap<>();
        result.put("user5Reviews", recentReviews);
        result.put("user5Purchases", recentPayment);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") Long id){
        userRepository.deleteById(id);
    }



}
