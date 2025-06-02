package com.example.skip.dto.rent;

import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.enumeration.RentCategory;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class RentDTO {
    private Long rentId;
    private Long userId;
    private RentCategory category;
    private String name;
    private String phone;
    private Integer postalCode;
    private String basicAddress;
    private String streetAddress;
    private String detailedAddress;
    private String thumbnail;
    private String image1;
    private String image2;
    private String image3;
    private String description;
    private UserStatus status;
    private YesNo useYn;
    private Integer remainAdCash;
    private LocalDate createdAt;
    private String bizRegNumber;
    private YesNo bizStatus;
    private YesNo bizClosureFlag;



    public RentDTO(Rent rent){
        this.rentId=rent.getRentId();
        this.userId=rent.getUser().getUserId();
        this.category=rent.getCategory();
        this.name=rent.getName();
        this.phone=rent.getPhone();
        this.postalCode=rent.getPostalCode();
        this.basicAddress=rent.getBasicAddress();
        this.streetAddress=rent.getStreetAddress();
        this.detailedAddress=rent.getDetailedAddress();
        this.thumbnail=rent.getThumbnail();
        this.image1=rent.getImage1();
        this.image2=rent.getImage2();
        this.image3=rent.getImage3();
        this.description=rent.getDescription();
        this.status=rent.getStatus();
        this.useYn=rent.getUseYn();
        this.remainAdCash=rent.getRemainAdCash();
        this.createdAt=rent.getCreatedAt();
        this.bizRegNumber=rent.getBizRegNumber();
        this.bizStatus=rent.getBizStatus();
        this.bizClosureFlag=rent.getBizClosureFlag();

    }


    public Rent toEntity(User user){
        return Rent.builder()
                .rentId(rentId)
                .user(user)
                .category(category)
                .name(name)
                .phone(phone)
                .postalCode(postalCode)
                .basicAddress(basicAddress)
                .streetAddress(streetAddress)
                .detailedAddress(detailedAddress)
                .thumbnail(thumbnail)
                .image1(image1)
                .image2(image2)
                .image3(image3)
                .description(description)
                .status(status)
                .useYn(useYn)
                .remainAdCash(remainAdCash)
                .bizRegNumber(bizRegNumber)
                .bizStatus(bizStatus)
                .bizClosureFlag(bizClosureFlag)
                .build();
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> fb6632eb9f5db4c55aa17840ded0afe6d41061f1
