package com.example.skip.repository;

import com.example.skip.dto.projection.ReviewReplySummaryDTO;
import com.example.skip.entity.Review;
import com.example.skip.entity.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Long> {

    @Query("""
        SELECT
            r.replyId AS replyId,
            r.review.reviewId AS reviewId,
            r.user.userId AS userId,
            r.user.username AS username,
            r.content AS content,
            r.createdAt AS createdAt,
            r.updatedAt AS updatedAt
        FROM ReviewReply r
        WHERE r.review.reviewId =:reviewId
    """)
    Optional<ReviewReplySummaryDTO> findByReviewId(@Param("reviewId") Long reviewId);


    // ReviewReply의 존재 여부 확인
    Optional<ReviewReply> findByReview_ReviewId(Long reviewId);

    // reviewId만으로 해당 답변을 삭제
    void deleteByReview_ReviewId(Long reviewId);

    // reviewReply 중복방지
    boolean existsByReview_ReviewId(Long reviewId);

    Long review(Review review);

}
