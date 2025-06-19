package com.example.skip.entity;

import com.example.skip.converter.RegionConverter;
import com.example.skip.enumeration.Region;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
public class DailyRentStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rentId")
    private Rent rent;

    @Convert(converter = RegionConverter.class)
    private Region region;

    private Integer reservationCount;

    private LocalDate statDate;
}
