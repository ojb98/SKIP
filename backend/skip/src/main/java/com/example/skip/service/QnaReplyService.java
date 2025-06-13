package com.example.skip.service;

import com.example.skip.dto.QnaReplyRequestDTO;
import com.example.skip.dto.QnaReplyResponseDTO;
import com.example.skip.dto.projection.QnaReplySummaryDTO;
import com.example.skip.entity.Qna;
import com.example.skip.entity.QnaReply;
import com.example.skip.entity.User;
import com.example.skip.repository.QnaReplyRepository;
import com.example.skip.repository.QnaRepository;
import com.example.skip.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class QnaReplyService {

    private final QnaReplyRepository qnaReplyRepository;
    private final QnaRepository qnaRepository;
    private final UserRepository userRepository;
    
    // 중복 답변 방지
    public void isDuplicateReply(Long qnaId) {
        if(qnaReplyRepository.existsByQna_QnaId(qnaId)) {
            throw new IllegalStateException("이미 해당 문의에 대한 답변이 존재합니다.");
        }
    }
    
    // 답변 저장
    public Long saveReply(QnaReplyRequestDTO requestDTO) {
        // Q&A 조회
        Qna qna = qnaRepository.findById(requestDTO.getQnaId()).orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        // User 조회
        User user = userRepository.findById(requestDTO.getUserId()).orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        
        // 중복 답변 방지
        isDuplicateReply(requestDTO.getQnaId());
        
        // 저장
        QnaReply qnaReply = QnaReply.builder()
                            .qna(qna)
                            .user(user)
                            .content(requestDTO.getContent())
                            .build();

        return qnaReplyRepository.save(qnaReply).getReplyId();
    }
    
    // 단건 조회(수정, 삭제시 사용)
    public QnaReplyResponseDTO getReply(Long qnaId) {
        QnaReply qnaReply = qnaReplyRepository.findByQna_QnaId(qnaId).orElseThrow(() -> new EntityNotFoundException("답변이 존재하지 않습니다."));

        return new QnaReplyResponseDTO(qnaReply);
    }

    // 답변 정보 조회(QnaReplySummaeyDTO)
    public QnaReplySummaryDTO getReplySummary(Long qnaId) {
        return qnaReplyRepository.findByQnaId(qnaId).orElse(null); //답변이 없는 상태도 정상처리 null값 전달
    }

    // 답변 수정
    public void updateReply(Long qnaId, String updatedContent, Long currentUserId) {
        QnaReply qnaReply = qnaReplyRepository.findByQna_QnaId(qnaId)
                .orElseThrow(() -> new EntityNotFoundException("수정할 답변이 존재하지 않습니다."));

        // 작성자와 수정 요청자가 동일한지 검증
        if(!qnaReply.getUser().getUserId().equals(currentUserId)) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        qnaReply.setContent(updatedContent);
        qnaReplyRepository.save(qnaReply);
    }

    // 답변 삭제
    public void deleteReply(Long qnaId, Long currentUserId) {
        QnaReply qnaReply = qnaReplyRepository.findByQna_QnaId(qnaId)
                .orElseThrow(() -> new EntityNotFoundException("삭제할 답변이 존재하지 않습니다."));

        if(!qnaReply.getUser().getUserId().equals(currentUserId)) {
            throw new SecurityException("작성자만 삭제 가능합니다.");
        }

        qnaReplyRepository.delete(qnaReply);
    }

}
