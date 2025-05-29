package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
public class NaverLinkage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long linkageId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String naverId;

    @Column(nullable = false)
    private Boolean usernameSet;

    @Column(nullable = false)
    private Boolean passwordSet;

    @CreatedDate
    private LocalDateTime linkedAt;
}
