package com.example.skip.entity;

import com.example.skip.converter.RegionConverter;
import com.example.skip.enumeration.Region;
import com.example.skip.enumeration.RentCategory;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import com.example.skip.handler.RentChangeListener;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Getter
@Setter
@Entity
@Builder
@EntityListeners({AuditingEntityListener.class, RentChangeListener.class})
@NoArgsConstructor
@AllArgsConstructor
public class Rent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentCategory category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private Integer postalCode;  //우편번호

    @Column(nullable = false)
    private String basicAddress;

    @Column(nullable = false)
    private String streetAddress;

    @Column(nullable = false)
    private String detailedAddress;

    @Column(nullable = false)
    private String thumbnail;

    // 이미지1는 필수로 변경예정
    @Column(nullable = false)
    private String image1;

    @Column(nullable = true)
    private String image2;

    @Column(nullable = true)
    private String image3;

    @Lob
    @Column(nullable = true)
    private String description;

    //최고 관리자 승인처리여부
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status= UserStatus.PENDING;  //default-대기

    //RENT 삭제여부
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private YesNo useYn = YesNo.Y;

    @Column(nullable = false)
    @Builder.Default
    private Integer remainAdCash = 0;  //광고료 충전

    @CreatedDate
    private LocalDate createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    //사업자등록 관련 컬럼
    @Column(name = "bizregnumber", nullable = false, unique = true)
    private String bizRegNumber;   //사업자등록번호

    @Enumerated(EnumType.STRING)
    @Column(name = "bizstaus", nullable = false)
    private YesNo bizStatus;   //유효한(운영중인지) 사업자인지 여부

    //사업자등록번호 진위확인 관련 컬럼
    @Enumerated(EnumType.STRING)
    @Column(name = "bizclosureflag",nullable = false)
    private YesNo bizClosureFlag; //휴업/폐업여부 (Y / N)

    @Convert(converter = RegionConverter.class)
    private Region region;


    @PrePersist
    @PreUpdate
    public void updateRegion() {
        this.region = Region.fromFullAddress(streetAddress);
    }
}
