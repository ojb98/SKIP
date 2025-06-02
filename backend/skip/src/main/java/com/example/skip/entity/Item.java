package com.example.skip.entity;

import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//Item 클래스에 이 어노테이션을 추가하여 JSON 직렬화 시 Lazy 로딩 관련 프록시 객체를 무시할 수 있습니다.
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rentId", nullable = false)
    private Rent rent;

    @Column(nullable = false)
    private String name;

    private String image;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCategory category;

    @CreatedDate
    private LocalDate createdAt;

    //양방향 연관 관계를 추가 ( item <-> itemDetail )
    /*
        mappedBy = 자식의 필드명,
        CascadeType.ALL: 부모(Entity)의 작업이 자식(Entity)에게도 전이되어 같이 적용
            -> ex) Item 저장, 삭제, 병합, 갱신 시 ItemDetail도 같이 처리됨,
        orphanRemoval = 부모와 연관이 끊어진 자식 엔티티를 자동으로 삭제해주는 기능
    */
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemDetail> itemDetails = new ArrayList<>();

}