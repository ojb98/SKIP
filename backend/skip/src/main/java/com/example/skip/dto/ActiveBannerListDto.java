package com.example.skip.dto;

import com.example.skip.entity.Rent;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActiveBannerListDto implements Serializable {
    private Long bannerId;

    private Long rentId;

    private String bannerImage;

    private Integer clickCnt;

    private Integer cpcBid;

    private BigDecimal finalScore;

    private LocalDateTime endDate;

    private LocalDateTime uploadDate;
}
