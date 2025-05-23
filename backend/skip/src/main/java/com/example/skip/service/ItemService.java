package com.example.skip.service;

import com.example.skip.dto.ItemDTO;
import com.example.skip.dto.ItemRequestDTO;
import com.example.skip.dto.RentDTO;
import com.example.skip.entity.Item;
import com.example.skip.entity.Rent;
import com.example.skip.entity.User;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.ItemRepository;
import com.example.skip.repository.RentRepository;
import com.example.skip.util.FileUploadUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final RentRepository rentRepository;
    private final FileService fileService;
    private final FileUploadUtil fileUploadUtil;

    //등록
    public Long registerItem(ItemRequestDTO itemRequestDTO){
        Rent rent = rentRepository.findById(itemRequestDTO.getRentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 렌트샵을 찾을 수 없습니다."));

        String imageUrl = fileService.uploadFile(itemRequestDTO.getImage(),"items");

        Item item = Item.builder()
                .rent(rent)
                .name(itemRequestDTO.getName())
                .size(itemRequestDTO.getSize())
                .totalQuantity(itemRequestDTO.getTotalQuantity())
                .stockQuantity(itemRequestDTO.getStockQuantity())
                .image(imageUrl)
                .category(itemRequestDTO.getCategory())
                .rentHour(itemRequestDTO.getRentHour())
                .price(itemRequestDTO.getPrice())
                .isActive(Optional.ofNullable(itemRequestDTO.getIsActive()).orElse(YesNo.Y))
                .createdAt(itemRequestDTO.getCreatedAt())
                .build();

        Item saved=itemRepository.save(item);
        return saved.getItemId();
    }

    //단건 조회
    public ItemDTO getItem(Long itemId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(()-> new IllegalArgumentException("해당 장비를 찾을수 없습니다."));
        return new ItemDTO(item);
    }

    //전체 조회(렌탈샵 기준 + 사용중인 장비 + 등록일 내림차순)
    public List<ItemDTO> getAllItemsByDesc(Long rentId){
        List<Item> item =
                itemRepository.findByRent_RentIdAndIsActive(rentId,YesNo.Y, Sort.by(Sort.Order.desc("createdAt")));
        return item.stream().map(i->new ItemDTO(i)).toList();
    }

    //수정
    public void updateItem(ItemRequestDTO itemRequestDTO){
        Item item = itemRepository.findById(itemRequestDTO.getItemId())
                .orElseThrow(()-> new IllegalArgumentException("해당 장비를 찾을수 없습니다."));

        //이미지 업로드 처리 (없으면 기존 이미지 유지)
        String updatedImageUrl = fileUploadUtil.uploadFileAndUpdateUrl(itemRequestDTO.getImage(), item.getImage(), "item");
        item.setImage(updatedImageUrl);

        item.setName(itemRequestDTO.getName());
        item.setSize(itemRequestDTO.getSize());
        item.setTotalQuantity(itemRequestDTO.getTotalQuantity());
        item.setStockQuantity(itemRequestDTO.getStockQuantity());
        item.setRentHour(itemRequestDTO.getRentHour());
        item.setPrice(itemRequestDTO.getPrice());
        item.setCreatedAt(itemRequestDTO.getCreatedAt());
    }

    //삭제(사용여부:isActive = N)
    public void deleteItem(Long itemId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(()-> new IllegalArgumentException("해당 장비를 찾을 수 없습니다."));
        item.setIsActive(YesNo.N);  //사용안함 표시
    }


}
