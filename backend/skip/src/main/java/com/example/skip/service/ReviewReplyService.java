package com.example.skip.service;

import com.example.skip.dto.ReviewReplyRequestDTO;
import com.example.skip.dto.ReviewReplyResponseDTO;
import com.example.skip.dto.UserDto;
import com.example.skip.dto.projection.ReviewReplySummaryDTO;
import com.example.skip.entity.Review;
import com.example.skip.entity.ReviewReply;
import com.example.skip.entity.User;
import com.example.skip.repository.ReviewReplyRepository;
import com.example.skip.repository.ReviewRepository;
import com.example.skip.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewReplyService {

    private final ReviewReplyRepository reviewReplyRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public void validateDuplicateReply(Long reviewId) {
        if(reviewReplyRepository.existsByReview_ReviewId(reviewId)){
            throw new IllegalStateException("이미 해당 리뷰에 대한 답변이 존재합니다.");
        }
    }
    
    // 리뷰 답변 작성
    public ReviewReplyResponseDTO saveReviewReply(ReviewReplyRequestDTO dto, UserDto userDto) {
        Review review = reviewRepository.findById(dto.getReviewId())
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
        User user = userRepository.findByUserId(userDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("관리자 정보를 찾을 수 없습니다."));

        // 답변 중복 체크
        validateDuplicateReply(dto.getReviewId());

        ReviewReply reply = dto.toEntity(review, user);
        return ReviewReplyResponseDTO.fromEntity(reviewReplyRepository.save(reply));
    }

    // 리뷰 답변 수정
    public ReviewReplyResponseDTO updateReviewReply(Long reviewId, ReviewReplyRequestDTO dto, UserDto userDto) {
        ReviewReply reply = reviewReplyRepository.findByReview_ReviewId(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰에 대한 답변이 없습니다."));

        if(!reply.getUser().getUserId().equals(userDto.getUserId())) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        reply.setContent(dto.getContent());
        return ReviewReplyResponseDTO.fromEntity(reply);
    }

    // 리뷰 답변 삭제
    public void deleteReply(Long reviewId, UserDto userDto) {
        ReviewReply reply = reviewReplyRepository.findByReview_ReviewId(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰에 대한 답변이 없습니다."));

        if(!reply.getUser().getUserId().equals(userDto.getUserId())){
            throw new SecurityException("작성자만 삭제할 수 있습니다.");
        }

        reviewReplyRepository.delete(reply);
    }

    // 리뷰 답변 단건 조회
    public ReviewReplyResponseDTO getReplyByReview(Long reviewId, UserDto userDto) {
        ReviewReply reply = reviewReplyRepository.findByReview_ReviewId(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰에 대한 답변이 없습니다."));

        if(!reply.getUser().getUserId().equals(userDto.getUserId())){
            throw new SecurityException("작성자만 조회할 수 있습니다.");
        }

        return ReviewReplyResponseDTO.fromEntity(reply);
    }

    // 리뷰 답변 정보 조회(ReviewReplySummaryDTO)
    public ReviewReplySummaryDTO getReplySummary(Long reviewId) {
        return reviewReplyRepository.findByReviewId(reviewId).orElse(null);
    }
}
