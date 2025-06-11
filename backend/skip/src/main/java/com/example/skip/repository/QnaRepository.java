package com.example.skip.repository;

import com.example.skip.dto.projection.QnaListDTO;
import com.example.skip.dto.projection.QnaWithReplyDTO;
import com.example.skip.entity.Qna;
import com.example.skip.enumeration.QnaStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface QnaRepository extends JpaRepository<Qna, Long> {

    // 관리자 페이지 Qna 조회
    @Query("""
        SELECT q.qnaId as qnaId,
               q.title as title,
               q.content as content,
               u.username as username,
               i.name as itemName,
               q.status as status,
               q.secret as secret,
               q.createdAt as createdAt,
               q.updatedAt as updatedAt
        FROM Qna q
        JOIN q.user u
        JOIN q.item i
        JOIN i.rent r
        WHERE r.rentId =:rentId
        AND(:status IS NULL OR q.status =:status)
        AND(:username IS NULL OR u.username LIKE %:username%)
        AND(:itemName IS NULL OR i.name LIKE %:itemName%)
        AND(:secret IS NULL OR q.secret =:secret)
    """)
    Page<QnaListDTO> findQnaListByRentalshopWithFilters(@Param("rentId")Long rentId,
                                                        @Param("status")QnaStatus status,
                                                        @Param("username")String username,
                                                        @Param("itemName")String itemName,
                                                        @Param("secret")Boolean secret,
                                                        Pageable pageable);

    // 수정
    @Query("""
        SELECT q 
        FROM Qna q
        JOIN FETCH q.user u
        JOIN FETCH q.item i
        JOIN FETCH i.rent r
        WHERE q.qnaId =:qnaId
    """)
    Qna findDetailById(@Param("qnaId")Long qnaId);

    // 삭제 (사용자)
    boolean existsByQnaIdAndUser_UserId(Long qnaId, Long userId);

    // 삭제 (관리자)
    boolean existsByQnaIdAndItem_Rent_RentId(Long qnaId, Long rentId);

    // 단건 조회 (수정, 삭제용) (Projection)
    @Query("""
        SELECT
            q.qnaId AS qnaId,
            q.title AS title,
            q.content AS content,
            u.username AS username,
            i.itemId AS itemId,
            r.rentId AS rentId,
            i.name AS itemName,
            i.image AS itemImage,
            q.secret AS secret,
            q.createdAt AS createdAt,
            q.updatedAt AS updatedAt,
            qr.replyId AS replyId,
            qr.content AS replyContent,
            ru.username AS replyUsername,
            qr.createdAt AS replyCreatedAt,
            qr.updatedAt AS replyUpdatedAt
        FROM Qna q
        JOIN q.user u
        JOIN q.item i
        JOIN i.rent r
        LEFT JOIN QnaReply qr ON qr.qna.qnaId = q.qnaId
        LEFT JOIN qr.user ru
        WHERE q.qnaId = :qnaId
    """)
    QnaWithReplyDTO findDetailByQnaId(@Param("qnaId") Long qnaId);


    // 마이 페이지 Q&A 조회(Projection)
    @Query("""
        SELECT q.qnaId as qnaId,
               q.title as title,
               q.content as content,
               u.username as username,
               r.rentId as rentId,
               i.itemId as itemId,
               i.name as itemName,
               i.image as itemImage,
               q.secret as secret,
               q.createdAt as createdAt,
               q.updatedAt as updatedAt,
               rpl.replyId as replyId,
               rpl.content as replyContent,
               ru.username as replyUsername,
               rpl.createdAt as replyCreatedAt,
               rpl.updatedAt as replyUpdatedAt
        FROM Qna q
        JOIN q.user u
        JOIN q.item i
        JOIN i.rent r
        LEFT JOIN QnaReply rpl ON rpl.qna.qnaId = q.qnaId
        LEFT JOIN rpl.user ru
        WHERE u.userId =:userId
        AND (:hasReply IS NULL OR (:hasReply = TRUE AND rpl.replyId IS NOT NULL) OR (:hasReply = FALSE AND rpl.replyId IS NULL))
        AND (:startDate IS NULL OR q.createdAt >=:startDate)
        ORDER BY q.createdAt DESC
    """)
    Page<QnaWithReplyDTO> findQnaWithReplyByUserIdAndFilter(@Param("userId") Long userId,
                                                            @Param("hasReply") Boolean hasReply,
                                                            @Param("startDate") LocalDateTime startDate,
                                                            Pageable pageable);

    // 아이템 페이지 Q&A 조회 (Projection)
    @Query("""
        SELECT q.qnaId as qnaId,
               q.title as title,
               q.content as content,
               u.username as username,
               r.rentId as rentId,
               i.itemId as itemId,
               i.name as itemName,
               i.image as itemImage,
               q.secret as secret,
               q.status as status,
               q.createdAt as createdAt,
               q.updatedAt as updatedAt,
               rpl.replyId as replyId,
               rpl.content as replyContent,
               ru.username as replyUsername,
               rpl.createdAt as replyCreatedAt,
               rpl.updatedAt as replyUpdatedAt
         FROM Qna q
         JOIN q.user u
         JOIN q.item i
         JOIN i.rent r
         LEFT JOIN QnaReply rpl ON rpl.qna.qnaId = q.qnaId
         LEFT JOIN rpl.user ru
         WHERE i.itemId =:itemId
         AND (:hasReply IS NULL OR (:hasReply = TRUE AND rpl.replyId IS NOT NULL)
         OR (:hasReply = FALSE AND rpl.replyId IS NULL))
         AND (:status IS NULL OR q.status = :status)
         AND (:secret IS NULL OR q.secret = :secret)
         ORDER BY q.createdAt DESC
        """)

    Page<QnaWithReplyDTO> findQnaWithReplyByItemAndFilter(@Param("itemId") Long itemId,
                                                          @Param("hasReply") Boolean hasReply,
                                                          @Param("status") QnaStatus status,
                                                          @Param("secret") Boolean secret,
                                                          @Param("currentUserId") Long currentUserId,
                                                          Pageable pageable);

    // Q&A 3개월 마다 자동 삭제
    @Transactional
    @Modifying
    @Query("DELETE FROM Qna q WHERE q.createdAt < :cutoff")
    void deleteByCreatedAtBefore(@Param("cutoff") LocalDateTime cutoff);
}
