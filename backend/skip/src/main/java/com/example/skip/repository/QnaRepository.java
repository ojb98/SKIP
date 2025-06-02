package com.example.skip.repository;

import com.example.skip.dto.projection.QnaListDTO;
import com.example.skip.entity.Qna;
import com.example.skip.entity.User;
import com.example.skip.enumeration.QnaStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QnaRepository extends JpaRepository<Qna, Long> {
    // 아이템 페이지 Qna 전체 조회(페이징)
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
        WHERE i.itemId = :itemId
        AND (:status IS NULL OR q.status =:status)
        AND (:secret IS NULL OR q.secret =:secret)
        
    """)
    Page<QnaListDTO> findQnaListByItemWithFilters(@Param("itemId")Long itemId,
                                                  @Param("status")QnaStatus status,
                                                  @Param("secret")Boolean secret,
                                                  Pageable pageable);

    // 마이 페이지 Qna 조회
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
        WHERE u.userId =:userId
        AND(:status IS NULL OR q.status =:status)
        AND(:secret IS NULL OR q.secret =:secret)
    """)
    Page<QnaListDTO> findQnaListByUserWithFilters(@Param("userId")Long userId,
                                                  @Param("status")QnaStatus status,
                                                  @Param("secret")Boolean secret,
                                                  Pageable pageable);

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

    // 단건 조회 (수정, 삭제용)
    @Query("""
        SELECT q 
        FROM Qna q
        JOIN FETCH q.user u
        JOIN FETCH q.item i
        JOIN FETCH i.rent r
        WHERE q.qnaId =:qnaId
    """)
    Qna findDetailById(@Param("qnaId")Long qnaId);

    boolean existsByQnaIdAndUser_UserId(Long qnaId, Long userId);

    boolean existsByQnaIdAndItem_Rent_RentId(Long qnaId, Long rentId);

}
