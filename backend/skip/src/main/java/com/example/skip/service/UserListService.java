package com.example.skip.service;

import com.example.skip.dto.payment.PaymentDTO;
import com.example.skip.dto.ReviewDTO;
import com.example.skip.entity.Payment;
import com.example.skip.entity.Review;
import com.example.skip.repository.PaymentRepository;
import com.example.skip.repository.ReviewRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserListService {
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;

    public UserListService(PaymentRepository paymentRepository, ReviewRepository reviewRepository) {
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ReviewDTO> getUserRecentReviews(Long userId) {
        List<Review> reviews = reviewRepository
                .findTop5ByReservationItem_Reservation_User_UserIdOrderByCreatedAtDesc(userId);

        return reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getUserRecentPayments(Long userId) {
        List<Payment> payments = paymentRepository
                .findTop5ByUserIdInReservations(userId, PageRequest.of(0, 5));

        return payments.stream()
                .map(PaymentDTO::new)
                .collect(Collectors.toList());
    }
}
