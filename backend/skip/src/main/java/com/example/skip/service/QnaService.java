package com.example.skip.service;

import com.example.skip.dto.QnaDTO;
import com.example.skip.dto.QnaRequestDTO;
import com.example.skip.dto.projection.QnaListDTO;
import com.example.skip.dto.projection.QnaWithReplyDTO;
import com.example.skip.entity.Item;
import com.example.skip.entity.Qna;
import com.example.skip.entity.User;
import com.example.skip.enumeration.QnaStatus;
import com.example.skip.repository.ItemRepository;
import com.example.skip.repository.QnaRepository;
import com.example.skip.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class QnaService {

    private final QnaRepository qnaRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    
    // Q&A 등록
    public QnaDTO createQna(QnaRequestDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));
        Item item = itemRepository.findById(dto.getItemId()).orElseThrow(() -> new EntityNotFoundException("아이템을 찾을 수 없습니다."));

        Qna qna = Qna.builder()
                .user(user)
                .item(item)
                .title(dto.getTitle())
                .content(dto.getContent())
                .status(QnaStatus.WAITING)
                .secret(dto.isSecret())
                .build();

        System.out.println("엔티티 상태:" + qna.getStatus());

        return new QnaDTO(qnaRepository.save(qna));
    }

    // Q&A 수정
    public QnaDTO updateQna(Long qnaId, QnaRequestDTO dto, Long userId) {
        Qna qna = qnaRepository.findDetailById(qnaId);

        if(!qna.getUser().getUserId().equals(userId)) {
            throw new SecurityException("수정 권한이 없습니다.");
        }

        qna.setTitle(dto.getTitle());
        qna.setContent(dto.getContent());
        qna.setSecret(dto.isSecret());

        return new QnaDTO(qna);
    }

    // 삭제 - 사용자
    public void deleteQnaByUser(Long qnaId, Long userId) {
        if(!qnaRepository.existsByQnaIdAndUser_UserId(qnaId, userId)) {
            throw new SecurityException("삭제 권한이 없습니다.");
        }
        qnaRepository.deleteById(qnaId);
    }

    // 삭제 - 관리자
    public void deleteQnaByAdmin(Long qnaId, Long rentId) {
        if(!qnaRepository.existsByQnaIdAndItem_Rent_RentId(qnaId, rentId)) {
            throw new SecurityException("삭제 권한이 없습니다.");
        }
        qnaRepository.deleteById(qnaId);
    }

    // 관리자 페이지 Q&A 조회
    public Page<QnaListDTO> getQnaListByRent(Long rentId, QnaStatus status, String username, String itemName, Boolean secret, Boolean hasReply, Pageable pageable) {
        return qnaRepository.findQnaListByRentalshopWithFilters(rentId, status, username, itemName, secret, hasReply, pageable);
    }

    // 관리자 페이지 미답변 개수
    public long getUnansweredCountByRentId(Long rentId) {
        return qnaRepository.countUnansweredByRentId(rentId);
    }

    // 마이 페이지 Q&A 조회 (projection)
    public Page<QnaWithReplyDTO> getQnaWithReplyByUserId(Long userId, Boolean hasReply, LocalDateTime startDate, Pageable pageable) {
        return qnaRepository.findQnaWithReplyByUserIdAndFilter(userId, hasReply, startDate, pageable);
    }

    // 아이템 페이지 Q&A 조회 (projection)
    public Page<QnaWithReplyDTO> getQnaWithReplyByItemId(Long itemId,
                                                         Boolean hasReply,
                                                         QnaStatus status,
                                                         Boolean secret,
                                                         Long currentUserId,
                                                         Pageable pageable) {
        return qnaRepository.findQnaWithReplyByItemAndFilter(itemId, hasReply, status, secret, currentUserId, pageable);
    }

    // Q&A 단건 상세 조회
    public QnaWithReplyDTO getQnaDetail(Long qnaId) {
        return qnaRepository.findDetailByQnaId(qnaId);
    }

    // Q&A 3개월 마다 자동 삭제
    @Scheduled(cron = "0 0 0 * * ?") // 매 자정마다 실행
    public void deleteOldQna() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(3); // 3개월 단위 Q&A 삭제
        qnaRepository.deleteByCreatedAtBefore(cutoffDate);
    }

}
