package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Boost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boostId;

    @Column(nullable = false)  // 1:N 조인 생략하고 NotNull조건을 부여, 복잡성 감소
    private Long rentId;
    private Integer boost;
    private Integer cpb;
    private LocalDateTime endDate;

    @CreatedDate
    private LocalDateTime createdDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;
}
