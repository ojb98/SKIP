package com.example.skip.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = {"reservationItem"})
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rentItemId", nullable = false)
    private ReservationItem reservationItem;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private String content;

    private String image;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Review 삭제 시 ReviewReply도 삭제되도록
    @OneToOne(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ReviewReply reviewReply;


}