package com.example.skip.service;

import com.example.skip.dto.rent.RentDTO;
import com.example.skip.dto.rent.RentRequestDTO;
import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.RentRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.util.FileUploadUtil;
import com.example.skip.util.FileUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
@RequiredArgsConstructor
public class RentService {

    private final UserRepository userRepository;
    private final RentRepository rentRepository;
    private final FileUploadUtil fileUploadUtil;
    private final FileUtil fileUtil;

    //등록
    public Long createRent(RentRequestDTO rentRequestDTO){

        String thumbnailUrl = null;
        String imageUrl1 = null;
        String imageUrl2 = null;
        String imageUrl3 = null;

        try {
            User user = userRepository.findById(rentRequestDTO.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

            // 파일 업로드 처리
            thumbnailUrl = fileUtil.uploadFile(rentRequestDTO.getThumbnail(), "rents");
            imageUrl1 = fileUtil.uploadFile(rentRequestDTO.getImage1(), "rents");
            imageUrl2 = fileUtil.uploadFile(rentRequestDTO.getImage2(), "rents");
            imageUrl3 = fileUtil.uploadFile(rentRequestDTO.getImage3(), "rents");

            Rent rent = Rent.builder()
                    .user(user)
                    .category(rentRequestDTO.getCategory())
                    .name(rentRequestDTO.getName())
                    .phone(rentRequestDTO.getPhone())
                    .postalCode(rentRequestDTO.getPostalCode())
                    .basicAddress(rentRequestDTO.getBasicAddress())
                    .streetAddress(rentRequestDTO.getStreetAddress())
                    .detailedAddress(rentRequestDTO.getDetailedAddress())
                    .thumbnail(thumbnailUrl)
                    .image1(imageUrl1)
                    .image2(imageUrl2)
                    .image3(imageUrl3)
                    .description(rentRequestDTO.getDescription())

                    //null처리해줌
                    .status(Optional.ofNullable(rentRequestDTO.getStatus()).orElse(UserStatus.PENDING))
                    .useYn(Optional.ofNullable(rentRequestDTO.getUseYn()).orElse(YesNo.Y))
                    .remainAdCash(Optional.ofNullable(rentRequestDTO.getRemainAdCash()).orElse(0))

                    .bizRegNumber(rentRequestDTO.getBizRegNumber())
                    .bizStatus(rentRequestDTO.getBizStatus())
                    .bizClosureFlag(rentRequestDTO.getBizClosureFlag())
                    .build();

            Rent saved = rentRepository.save(rent);
            return saved.getRentId();

        }catch (Exception e){
            deleteUploadedFiles(thumbnailUrl, imageUrl1, imageUrl2, imageUrl3);
            throw new RuntimeException("DB 저장 실패: " + e.getMessage(), e);
        }
    }

    //전체 조회(userid기준으로 전체 렌탈샵 조회)
    public List<RentDTO> getRentsByUserId(Long userId){
        List<Rent> rents=
                rentRepository.findByUser_UserIdAndUseYn(userId,YesNo.Y,Sort.by(Sort.Order.desc("createdAt")));
        return rents.stream().map(r->new RentDTO(r)).toList();
    }

    //전체 조회(createdAt - 내림차순)
    public List<RentDTO> getAllRentsByDesc(){
        List<Rent> rents = rentRepository.findAll(Sort.by(Sort.Order.desc("createdAt")));
        return rents.stream().map(r->new RentDTO(r)).toList();
    }

    //단건 조회
    public RentDTO getRent(Long rentId){
        Rent rent = rentRepository.findById(rentId)
                .orElseThrow(()-> new IllegalArgumentException("해당 렌탈샵을 찾을 수 없습니다."));
        return new RentDTO(rent);
    }

    //해당 렌탈샵 삭제(사용여부 : useYN = N )
    public void deleteRent(Long rentId){
        Rent rent = rentRepository.findById(rentId)
                .orElseThrow(()-> new IllegalArgumentException("해당 렌탈샵을 찾을 수 없습니다."));
        rent.setUseYn(YesNo.N);  //삭제표시
    }

    //수정
    public void updateRent(RentRequestDTO dto){
        Rent rent = rentRepository.findById(dto.getRentId())
                        .orElseThrow(()-> new IllegalArgumentException("해당 렌탈샵을 찾을 수 없습니다."));

        //사업자등록번호가 기존과 다르면 승인상태 대기로 변경
        if(!rent.getBizRegNumber().equals(dto.getBizRegNumber())){
            rent.setStatus(UserStatus.PENDING);
            rent.setBizRegNumber(dto.getBizRegNumber());
            rent.setBizStatus(dto.getBizStatus());
            rent.setBizClosureFlag(dto.getBizClosureFlag());
        }

        // 파일 업로드 처리 후 URL 업데이트(기존 파일 삭제 및 새로운 파일 업로드)
        rent.setThumbnail(fileUploadUtil.uploadFileAndUpdateUrl(dto.getThumbnail(), rent.getThumbnail(),"rents"));
        rent.setImage1(fileUploadUtil.uploadFileAndUpdateUrl(dto.getImage1(), rent.getImage1(),"rents"));
        rent.setImage2(fileUploadUtil.uploadFileAndUpdateUrl(dto.getImage2(), rent.getImage2(), "rents"));
        rent.setImage3(fileUploadUtil.uploadFileAndUpdateUrl(dto.getImage3(), rent.getImage3(), "rents"));

        rent.setCategory(dto.getCategory());
        rent.setName(dto.getName());
        rent.setPhone(dto.getPhone());
        rent.setPostalCode(dto.getPostalCode());
        rent.setBasicAddress(dto.getBasicAddress());
        rent.setStreetAddress(dto.getStreetAddress());
        rent.setDetailedAddress(dto.getDetailedAddress());
        rent.setDescription(dto.getDescription());

        //DB 업데이트
        rentRepository.save(rent);

    }

    //최고관리자 - 승인여부(대기,승인,반려) 기준 조회(createdAt 내림차순)
    public List<RentDTO> getRentsByStatusDesc(UserStatus status){
        List<Rent> rents = rentRepository.findByStatus(status,Sort.by(Sort.Order.desc("createdAt")));
        return rents.stream().map(r->new RentDTO(r)).toList();
    }

    // 롤백을 고려한 파일 삭제 메소드 추가
    private void deleteUploadedFiles(String thumbnailUrl, String imageUrl1, String imageUrl2, String imageUrl3) {
        try {
            if (thumbnailUrl != null) fileUtil.deleteFile(thumbnailUrl);
            if (imageUrl1 != null) fileUtil.deleteFile(imageUrl1);
            if (imageUrl2 != null) fileUtil.deleteFile(imageUrl2);
            if (imageUrl3 != null) fileUtil.deleteFile(imageUrl3);
        } catch (Exception e) {
            // 파일 삭제 실패 시 로그에 남기고 예외 처리
            e.printStackTrace();
        }
    }


}
