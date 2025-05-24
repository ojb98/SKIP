package com.example.skip.entity;

import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itemId", nullable = false)
    private Item item;

    @Column(nullable = true)
    private String size;

    @Column(nullable = false)
    private Integer totalQuantity;

    @Column(nullable = false)
    private Integer stockQuantity;

    @Column(nullable = true)
    private Integer rentHour;

    @Column(nullable = false)
    private Integer price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private YesNo isActive = YesNo.Y;

}
