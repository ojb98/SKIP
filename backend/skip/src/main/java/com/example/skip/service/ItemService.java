package com.example.skip.service;

import com.example.skip.dto.ItemRequestDTO;
import com.example.skip.dto.ItemRequestDTO.DetailGroup;
import com.example.skip.dto.ItemRequestDTO.SizeStock;
import com.example.skip.dto.ItemResponseDTO;
import com.example.skip.entity.Item;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.ItemRepository;
import com.example.skip.repository.RentRepository;
import com.example.skip.util.FileUploadUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemDetailRepository itemDetailRepository;
    private final RentRepository rentRepository;
    private final FileService fileService;
    private final FileUploadUtil fileUploadUtil;

    //장비 등록
    public Long registerItem(ItemRequestDTO dto){
        Rent rent = rentRepository.findById(dto.getRentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 렌트샵을 찾을 수 없습니다."));

        String imageUrl = fileService.uploadFile(dto.getImage(),"items");

        Item item = Item.builder()
                .rent(rent)
                .name(dto.getName())
                .image(imageUrl)
                .category(ItemCategory.valueOf(dto.getCategory()))
                .build();

        Item savedItem = itemRepository.save(item);

        if(dto.getDetailList() != null) {
            for(DetailGroup detailGroup : dto.getDetailList()) {
                for(SizeStock sizeStock : detailGroup.getSizeStockList()) {
                    ItemDetail detail = ItemDetail.builder()
                            .item(savedItem)
                            .rentHour(detailGroup.getRentHour())
                            .price(detailGroup.getPrice())
                            .size(sizeStock.getSize())
                            .totalQuantity(sizeStock.getTotalQuantity())
                            .stockQuantity(sizeStock.getStockQuantity())
                            .isActive(YesNo.Y)
                            .build();
                    itemDetailRepository.save(detail);
                }
            }
        }

        return savedItem.getItemId();
    }

    //장비 + 디테일 리스트
    public List<ItemResponseDTO> getItemByDetailList(Long rentId) {
        List<Item> items = itemRepository.findActiveItemsByRentId(rentId);

        return items.stream()
                .map(item -> {
                    List<ItemResponseDTO.ItemDetailDTO> activeDetails = item.getItemDetails().stream()
                            .filter(d -> d.getIsActive() == YesNo.Y)
                            .map(d -> new ItemResponseDTO.ItemDetailDTO(
                                    d.getRentHour(),
                                    d.getPrice(),
                                    d.getSize(),
                                    d.getTotalQuantity(),
                                    d.getStockQuantity()
                            ))
                            .collect(Collectors.toList());

                    return new ItemResponseDTO(
                            item.getItemId(),
                            item.getName(),
                            item.getCategory().name(),
                            item.getImage(),
                            activeDetails
                    );
                })
                .collect(Collectors.toList());
    }

}
