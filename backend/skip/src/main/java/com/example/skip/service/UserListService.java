package com.example.skip.service;

import com.example.skip.entity.Payment;
import com.example.skip.entity.Review;
import com.example.skip.repository.PaymentRepository;
import com.example.skip.repository.ReviewRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserListService {
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;

    public UserListService(PaymentRepository paymentRepository, ReviewRepository reviewRepository) {
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
    }

    public Map<String, Object> getUserListActivity(Long userId) {
        Map<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(0, 5); // 상위 5개만 조회

        List<Payment> payments = paymentRepository.findTop5ByUserId(userId, pageable);
        List<Review> reviews = reviewRepository.findTop5ByUserId(userId, pageable);

        result.put("user5Purchases", payments);
        result.put("user5Reviews", reviews);

        return result;
    }
}
