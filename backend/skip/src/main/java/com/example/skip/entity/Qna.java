package com.example.skip.entity;

import com.example.skip.enumeration.QnaStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude =  {"user", "item", "qnaReply"})
@Builder
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qnaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itemId", nullable = false)
    private Item item;

    @Column(nullable = false)
    @Size(max = 20)
    private String title;

    @Column(nullable = false)
    @Size(max = 100)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private QnaStatus status = QnaStatus.WAITING;

    @Column(nullable = false)
    private boolean secret;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Qna 삭제 시, QnaReply도 같이 삭제되도록
    @OneToOne(mappedBy = "qna", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private QnaReply qnaReply;
}
