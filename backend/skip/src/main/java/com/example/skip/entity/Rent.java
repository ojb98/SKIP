package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
public class Rent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    private String category;

    private String name;

    private String phone;

    private int postalCode;

    private String basicAddress;

    private String streetAddress;

    private String detailedAddress;

    private String thumbnail;

    private String image1;

    private String image2;

    private String image3;

    private String description;

    private String status;

    private String useYn;

    private Integer remainAdCash;

    @CreatedDate
    private LocalDateTime createdAt;
}
