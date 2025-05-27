package com.example.skip.service;

import com.example.skip.dto.ItemRequestDTO;
import com.example.skip.dto.ItemRequestDTO.DetailGroup;
import com.example.skip.dto.ItemRequestDTO.SizeStock;
import com.example.skip.dto.ItemResponseDTO.ItemDetailDTO;
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


import java.util.*;
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

        // 1. items 리스트를 스트림으로 변환
        return items.stream()
                // Item → ItemResponseDTO로 변환
                .map(item -> {
                    // 2. 각 Item에 대해 내부 ItemDetail을 ItemDetailDTO로 변환
                    List<ItemDetailDTO> activeDetails = item.getItemDetails().stream()
                            //비활성화된 상세정보는 제외 ('Y'인 경우만)
                            .filter(d -> d.getIsActive() == YesNo.Y)
                            .map(d -> new ItemDetailDTO(
                                    d.getItemDetailId(),
                                    d.getRentHour(),
                                    d.getPrice(),
                                    d.getSize(),
                                    d.getTotalQuantity(),
                                    d.getStockQuantity(),
                                    d.getIsActive()
                            )).toList();


                    // 3. 최종적으로 ItemResponseDTO로 감싸서 List<ItemResponseDTO>로 반환
                    return new ItemResponseDTO(
                            item.getItemId(),
                            item.getName(),
                            item.getCategory().name(),
                            item.getImage(),
                            activeDetails
                    );
                }).toList();
    }


    // 장비디테일 삭제
    public void setItemDetailDelete(Long itemId, Long itemDetailId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(()-> new IllegalArgumentException("해당 장비는 존재하지않습니다"));

        ItemDetail detail = itemDetailRepository.findById(itemDetailId)
                .orElseThrow(()-> new IllegalArgumentException("해당 장비항목이 존재하지않습니다"));

        // 상세 항목이 조회된 itemId와 일치하는지 확인
        if (!detail.getItem().getItemId().equals(item.getItemId())) {
            throw new IllegalArgumentException("해당 장비항목이 지정된 장비에 속하지 않습니다.");
        }

        detail.setIsActive(YesNo.N);
        itemDetailRepository.save(detail);
    }


    // 장비 + 디테일 수정하기 위한 조회
    public ItemRequestDTO getItemByRent(Long rentId, Long itemId) {
        Item item = itemRepository.findByRent_RentIdAndItemId(rentId, itemId)
                .orElseThrow(() -> new RuntimeException("해당 장비를 찾을 수 없습니다."));

        Map<String, ItemRequestDTO.DetailGroup> groupedDetails = new LinkedHashMap<>();

        item.getItemDetails().stream()
                .filter(d -> d.getIsActive() == YesNo.Y)
                .forEach(detail -> {
                    String groupKey = detail.getRentHour() + "-" + detail.getPrice();

                    ItemRequestDTO.SizeStock newStock = new ItemRequestDTO.SizeStock();
                    newStock.setSize(detail.getSize());
                    newStock.setTotalQuantity(detail.getTotalQuantity());
                    newStock.setStockQuantity(detail.getStockQuantity());

                    // 그룹이 존재하면 중복 검사 후 추가
                    if (groupedDetails.containsKey(groupKey)) {
                        ItemRequestDTO.DetailGroup group = groupedDetails.get(groupKey);
                        boolean isDuplicate = group.getSizeStockList().stream()
                                .anyMatch(s -> s.getSize().equals(newStock.getSize())
                                        && s.getTotalQuantity() == newStock.getTotalQuantity()
                                        && s.getStockQuantity() == newStock.getStockQuantity());

                        if (!isDuplicate) {
                            group.getSizeStockList().add(newStock);
                        }
                    } else {
                        // 새 그룹 생성
                        ItemRequestDTO.DetailGroup group = new ItemRequestDTO.DetailGroup();
                        group.setRentHour(detail.getRentHour());
                        group.setPrice(detail.getPrice());
                        List<ItemRequestDTO.SizeStock> sizeList = new ArrayList<>();
                        sizeList.add(newStock);
                        group.setSizeStockList(sizeList);

                        groupedDetails.put(groupKey, group);
                    }
                });

        // 최종 DTO 생성
        ItemRequestDTO dto = new ItemRequestDTO();
        dto.setItemId(item.getItemId());
        dto.setRentId(item.getRent().getRentId());
        dto.setCategory(item.getCategory().name());
        dto.setName(item.getName());
        dto.setDetailList(new ArrayList<>(groupedDetails.values()));

        return dto;
    }





    // 장비 + 디테일 수정


}
