package com.example.skip.dto.banner;

import com.example.skip.entity.BannerWaitingList;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BannerWaitingListDTO {
    private Long waitingId;
    private Long rentId;
    private String rentName;
    private Integer cpcBid;
    private String bannerImage;
    private LocalDateTime registDay;
    private String status;
    private String comments;
    private BigDecimal averageRating;
    private BigDecimal recent7dRating;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;


    public BannerWaitingListDTO(BannerWaitingList entity) {
        this.waitingId = entity.getWaitingId();
        if (entity.getRent() != null) {
            this.rentId = entity.getRent().getRentId();
            this.rentName = entity.getRent().getName();
        }
        this.cpcBid = entity.getCpcBid();
        this.bannerImage = entity.getBannerImage();
        this.registDay = entity.getRegistDay();
        if (entity.getStatus() != null) {
            this.status = entity.getStatus().name();
        }
        this.comments = entity.getComments();
        if (entity.getAverageRating() != null){
            this.averageRating = entity.getAverageRating();
        }
        if (entity.getAverageRating() != null){
            this.recent7dRating = entity.getRecent7dRating();
        }

        this.createdAt = entity.getCreatedAt();
        if (entity.getUpdatedAt() != null) {
            this.updatedAt = entity.getUpdatedAt();
        }
    }
}