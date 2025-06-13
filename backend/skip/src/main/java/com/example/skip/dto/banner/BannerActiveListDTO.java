package com.example.skip.dto.banner;

import com.example.skip.entity.BannerActiveList;
import com.example.skip.enumeration.BannerActiveListStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BannerActiveListDTO {
    private Long bannerId;
    private Long rentId;
    private String rentName;
    private String bannerImage;
    private Integer clickCnt;
    private Integer cpcBid;
    private BigDecimal finalScore;
    private LocalDateTime endDate;
    private LocalDateTime uploadDate;
    private BannerActiveListStatus status;

    public BannerActiveListDTO(BannerActiveList entity){
        this.bannerId = entity.getBannerId();
        this.rentId = entity.getRent().getRentId();
        this.rentName = entity.getRent().getName();
        this.bannerImage = entity.getBannerImage();
        this.clickCnt = entity.getClickCnt();
        this.cpcBid = entity.getCpcBid();
        this.finalScore = entity.getFinalScore();
        this.endDate = entity.getEndDate();
        this.uploadDate = entity.getUploadDate();
        this.status = entity.getStatus();
    }
}
