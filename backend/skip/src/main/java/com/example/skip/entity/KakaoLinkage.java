package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
public class KakaoLinkage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long linkageId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Long kakaoId;

    @Column(nullable = false)
    private Boolean usernameSet;

    @Column(nullable = false)
    private Boolean passwordSet;

    @Column(nullable = false)
    private Boolean nameSet;

    @Column(nullable = false)
    private Boolean phoneSet;

    @CreatedDate
    private LocalDateTime linkedAt;
}
