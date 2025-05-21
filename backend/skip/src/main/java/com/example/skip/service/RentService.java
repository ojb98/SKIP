package com.example.skip.service;

import com.example.skip.dto.RentDTO;
import com.example.skip.dto.RentRequestDTO;
import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.RentRepository;
import com.example.skip.repository.UserRepository;
import com.example.skip.util.FileUploadUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Service
@Transactional
@RequiredArgsConstructor
public class RentService {

    private final UserRepository userRepository;
    private final RentRepository rentRepository;
    private final FileUploadUtil fileUploadUtil;
    private final FileService fileService;

    //등록
    public Long createRent(RentRequestDTO rentRequestDTO){
        User user = userRepository.findById(rentRequestDTO.getUserId())
                .orElseThrow(()-> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

        // 파일 업로드 처리
        String thumbnailUrl = fileService.uploadFile(rentRequestDTO.getThumbnail(), "rents");
        String imageUrl1 = fileService.uploadFile(rentRequestDTO.getImage1(), "rents");
        String imageUrl2 = fileService.uploadFile(rentRequestDTO.getImage2(), "rents");
        String imageUrl3 = fileService.uploadFile(rentRequestDTO.getImage3(), "rents");

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
                .status(rentRequestDTO.getStatus())
                .useYn(rentRequestDTO.getUseYn())
                .remainAdCash(rentRequestDTO.getRemainAdCash())
                .createdAt(rentRequestDTO.getCreatedAt())
                .bizRegNumber(rentRequestDTO.getBizRegNumber())
                .isValid(rentRequestDTO.getIsValid())
                .regNumberValidity(rentRequestDTO.getRegNumberValidity())
                .regCheckDate(rentRequestDTO.getRegCheckDate())
                .build();
        Rent saved = rentRepository.save(rent);
        return saved.getRentId();
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
    public void updateRent(RentRequestDTO rentRequestDTO){
        Rent rent = rentRepository.findById(rentRequestDTO.getRentId())
                        .orElseThrow(()-> new IllegalArgumentException("해당 렌탈샵을 찾을 수 없습니다."));

        //사업자등록번호가 기존과 다르면 승인상태 대기로 변경
        if(!rent.getBizRegNumber().equals(rentRequestDTO.getBizRegNumber())){
            rent.setStatus(UserStatus.PENDING);
            rent.setBizRegNumber(rentRequestDTO.getBizRegNumber());
            rent.setIsValid(rentRequestDTO.getIsValid());
            rent.setRegNumberValidity(rentRequestDTO.getRegNumberValidity());
            rent.setRegCheckDate(rentRequestDTO.getRegCheckDate());
        }

        // 파일 업로드 처리 후 URL 업데이트
        rent.setThumbnail(fileUploadUtil.uploadFileAndUpdateUrl(rentRequestDTO.getThumbnail(), rent.getThumbnail(),"rent"));
        rent.setImage1(fileUploadUtil.uploadFileAndUpdateUrl(rentRequestDTO.getImage1(), rent.getImage1(),"rent"));
        rent.setImage2(fileUploadUtil.uploadFileAndUpdateUrl(rentRequestDTO.getImage2(), rent.getImage2(), "rent"));
        rent.setImage3(fileUploadUtil.uploadFileAndUpdateUrl(rentRequestDTO.getImage3(), rent.getImage3(), "rent"));

        rent.setCategory(rentRequestDTO.getCategory());
        rent.setName(rentRequestDTO.getName());
        rent.setPhone(rentRequestDTO.getPhone());
        rent.setPostalCode(rentRequestDTO.getPostalCode());
        rent.setBasicAddress(rentRequestDTO.getBasicAddress());
        rent.setStreetAddress(rentRequestDTO.getStreetAddress());
        rent.setDetailedAddress(rentRequestDTO.getDetailedAddress());
        rent.setDescription(rentRequestDTO.getDescription());

    }

    //최고관리자 - 승인여부(대기,승인,반려) 기준 조회(createdAt 내림차순)
    public List<RentDTO> getRentsByStatusDesc(UserStatus status){
        List<Rent> rents = rentRepository.findByStatus(status,Sort.by(Sort.Order.desc("createdAt")));
        return rents.stream().map(r->new RentDTO(r)).toList();
    }


}
