package com.example.skip.entity;

import com.example.skip.enumeration.BannerActiveListStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class BannerActiveList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bannerId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rent_id", nullable = false)
    private Rent rent;
    private String bannerImage;
    private Integer clickCnt;
    private Integer cpcBid;  //클릭당 비용
    @Column(precision = 10, scale = 5)
    private BigDecimal finalScore; //노출도 점수
    private LocalDateTime endDate;
    @CreatedDate
    private LocalDateTime uploadDate;
    @Enumerated(EnumType.STRING)
    private BannerActiveListStatus status;

}
