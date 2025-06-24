package com.example.skip.service;

import com.example.skip.dto.rent.RentRequestDTO;
import com.example.skip.enumeration.RentCategory;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@SpringBootTest
public class RentServiceTest {
    @Autowired
    private RentService rentService;


    @Test
    public void saveAll() {
        byte[] dummyImage = new byte[] { (byte)0xFF, (byte)0xD8, (byte)0xFF };
        MockMultipartFile mockMultipartFile = new MockMultipartFile(
                "file",
                "dummy.jpg",
                "image/jpeg",
                dummyImage
        );

//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("지산 포레스트 리조트")
//                        .phone("031-644-1200")
//                        .postalCode(17390)
//                        .basicAddress("경기도 이천시 마장면 해월리 산28-7")
//                        .streetAddress("경기 이천시 마장면 지산로 267")
//                        .detailedAddress("지산 포레스트 리조트")
//                        .description("합리적인 여유와 품격을 동시에 누리실 수 있도록 지산 컨트리 클럽이 특별한 휴식을 드립니다.")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("126-81-10959")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("엘리시안 강촌")
//                        .phone("033-260-2000")
//                        .postalCode(24464)
//                        .basicAddress("강원특별자치도 춘천시 남산면 백양리 29-1")
//                        .streetAddress("강원특별자치도 춘천시 남산면 북한강변길 688")
//                        .detailedAddress("엘리시안 강촌")
//                        .description("콘도미니엄, 골프, 스키를 즐길 수 있는 사계절 가족 휴양지! 엘리시안 강촌에서 느끼는 완벽한 재충전 늘 새로운 즐거움으로 가득합니다.")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("104-81-18121")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("비발디파크")
//                        .phone("033-260-2000")
//                        .postalCode(25102)
//                        .basicAddress("강원특별자치도 홍천군 서면 팔봉리 1290-2")
//                        .streetAddress("강원특별자치도 홍천군 서면 한치골길 262")
//                        .detailedAddress("비발디파크")
//                        .description("최고급 시설과 서비스를 갖춘 편의시설이 완비된 소노펠리체 비발디파크의 클럽하우스에서 휴식과 활력을 모두 누려보세요. 수영풀은 물론 바데풀, 유아풀이 있는 실내 수영장과 피트니스 센터, 사우나까지! 고객님들께 건강과 행복을 선사합니다.")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("223-81-08341")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("알펜시아 리조트")
//                        .phone("033-339-0000")
//                        .postalCode(25351)
//                        .basicAddress("강원특별자치도 평창군 대관령면 용산리 425")
//                        .streetAddress("강원특별자치도 평창군 대관령면 솔봉로 325")
//                        .detailedAddress("평창 알펜시아 리조트")
//                        .description("여권없이 즐기는 여행, 알펜시아 리조트")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("485-81-02533")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("오크벨리 리조트")
//                        .phone("1588-7676")
//                        .postalCode(26357)
//                        .basicAddress("강원특별자치도 원주시 지정면 월송리 1061")
//                        .streetAddress("강원특별자치도 원주시 지정면 오크밸리 1길 66")
//                        .detailedAddress("오크벨리 리조트")
//                        .description("천혜의 자연 속에서 이국적인 아름다움을 자랑하는 오크밸리는 수려한 자연 경관을 만끽할 수 있는 프리미엄 리조트입니다.")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("224-81-06308")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("오투리조트")
//                        .phone("033-580-7000")
//                        .postalCode(26010)
//                        .basicAddress("강원특별자치도 태백시 황지동 825")
//                        .streetAddress("강원도 태백시 서학로 861")
//                        .detailedAddress("오투리조트")
//                        .description("자연이 만든 야생스키장, O2 리조트")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("222-81-13889")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("웰리힐리파크")
//                        .phone("033-335-5757")
//                        .postalCode(25263 )
//                        .basicAddress("강원특별자치도 횡성군 둔내면 두원리 204")
//                        .streetAddress("강원특별자치도 횡성군 둔내면 고원로 451")
//                        .detailedAddress("웰리힐리파크")
//                        .description("강원도 청정지역의 사계절 종합휴양타운 웰리힐리파크!")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("224-81-52476")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("하이원 스키")
//                        .phone("1588-7789")
//                        .postalCode(26154 )
//                        .basicAddress("강원특별자치도 정선군 고한읍 고한리 424")
//                        .streetAddress("강원특별자치도 정선군 고한읍 고한7길 399")
//                        .detailedAddress("하이원 스키")
//                        .description("하이원 그랜드호텔은 고객 분들에게 최상의 만족을 드리기 위해 정성을 다한 객실들로 꾸며져 있습니다.")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("225-81-10770")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("휘닉스 스노우파크")
//                        .phone("1588-2828")
//                        .postalCode(25307)
//                        .basicAddress("강원특별자치도 평창군 봉평면 면온리 1120")
//                        .streetAddress("강원도 평창군 봉평면 태기로 174")
//                        .detailedAddress("휘닉스 스노우파크")
//                        .description("해발 700m 청정 고원지대에 자리잡은 휘닉스 파크는 휘닉스 스노우 파크, 호텔, 콘도, 휘닉스 컨트리클럽, 블루캐니언 등의 휴양 레저시설을 갖춘 종합리조트입니다.")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("224-85-05554")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
//
//        rentService.createRent(
//                RentRequestDTO.builder()
//                        .userId(2L)
//                        .category(RentCategory.SKI)
//                        .name("에덴밸리리조트")
//                        .phone("055-379-8000")
//                        .postalCode(50584)
//                        .basicAddress("경상남도 양산시 어곡동 산350-3")
//                        .streetAddress("경상남도 양산시 원동면 어실로 1206")
//                        .detailedAddress("에덴밸리리조트")
//                        .description("에덴밸리리조트입니다.")
//                        .status(UserStatus.APPROVED)
//                        .useYn(YesNo.Y)
//                        .remainAdCash(0)
//                        .bizRegNumber("621-81-03481")
//                        .bizStatus(YesNo.Y)
//                        .bizClosureFlag(YesNo.N)
//                        .thumbnail(mockMultipartFile)
//                        .image1(mockMultipartFile)
//                        .build()
//        );
    }
}
