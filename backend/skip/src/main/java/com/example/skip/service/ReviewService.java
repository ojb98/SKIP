package com.example.skip.service;

import com.example.skip.dto.ReviewDTO;
import com.example.skip.dto.ReviewRequestDTO;
import com.example.skip.entity.Reservations;
import com.example.skip.entity.Review;
import com.example.skip.entity.User;
import com.example.skip.repository.ReservationsRepository;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ReservationsRepository reservationsRepository;
    private final FileService fileService;

    private final String subDir = "review";

    // 리뷰 작성
    public ReviewDTO writeReview(ReviewRequestDTO dto, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
        Reservations reservations = reservationsRepository.findById(dto.getReserveId()).orElseThrow(() -> new IllegalArgumentException("예약이 존재하지 않습니다."));

        if (!reservations.getUser().getUserId().equals(userId)){
            throw new AccessDeniedException("본인이 예약한 리뷰만 작성할 수 있습니다.");
        }

        String imagePath = fileService.uploadFile(dto.getImageFile(), subDir);

        Review review = Review.builder()
                .reservations(reservations)
                .rating(dto.getRating())
                .content(dto.getContent())
                .image(imagePath)
                .build();

        Review saveReview = reviewRepository.save(review);
        return new ReviewDTO(saveReview);
    }

}
