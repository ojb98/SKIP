package com.example.skip.dto;

import com.example.skip.enumeration.RentCategory;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class RentRequestDTO {
    private Long rentId;
    private Long userId;
    private RentCategory category;
    private String name;
    private String phone;
    private Integer postalCode;
    private String basicAddress;
    private String streetAddress;
    private String detailedAddress;
    private MultipartFile thumbnail;
    private MultipartFile image1;
    private MultipartFile image2;
    private MultipartFile image3;
    private String description;
    private UserStatus status;
    private YesNo useYn;
    private Integer remainAdCash;
    private LocalDateTime createdAt;
    private String bizRegNumber;
    private YesNo isValid;
    private YesNo regNumberValidity;
    private LocalDateTime regCheckDate;
}
