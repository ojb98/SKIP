package com.example.skip.service;

import com.example.skip.dto.ItemDetailFlatDTO;
import com.example.skip.dto.ItemDetailPageDTO;
import com.example.skip.dto.item.ItemRequestDTO;
import com.example.skip.dto.item.ItemRequestDTO.DetailGroup;
import com.example.skip.dto.item.ItemRequestDTO.SizeStock;
import com.example.skip.dto.item.ItemResponseDTO.ItemDetailDTO;
import com.example.skip.dto.item.ItemResponseDTO;
import com.example.skip.dto.item.*;
import com.example.skip.entity.Item;
import com.example.skip.entity.ItemDetail;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.ItemDetailRepository;
import com.example.skip.repository.ItemRepository;
import com.example.skip.repository.RentRepository;
import com.example.skip.util.FileUploadUtil;
import com.example.skip.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemDetailRepository itemDetailRepository;
    private final RentRepository rentRepository;
    private final FileUtil fileUtil;
    private final FileUploadUtil fileUploadUtil;

    //장비 등록
    public Long registerItem(ItemRequestDTO dto){
        Rent rent = rentRepository.findById(dto.getRentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 렌트샵을 찾을 수 없습니다."));

        String imageUrl = fileUtil.uploadFile(dto.getImage(),"items");

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
                .map(item -> {
                    // 활성 상태의 디테일만 추림
                    List<ItemResponseDTO.ItemDetailDTO> sortedDetailList =
                            item.getItemDetails().stream()
                                // 비활성화된 상세정보는 제외 ('Y'인 경우만)
                                // 그 장비가 가진 상세 옵션들 중 활성 상태인 것만 추려내는 것
                                .filter(d -> d.getIsActive() == YesNo.Y)
                                // 사이즈 → 렌트 시간 기준 정렬 (복합 정렬)
                                .sorted(Comparator
                                        .comparing(ItemDetail::getSize, Comparator.nullsLast(String::compareTo))
                                        .thenComparing(ItemDetail::getRentHour, Comparator.nullsLast(Integer::compareTo)))
                                .map(d -> new ItemResponseDTO.ItemDetailDTO(
                                        d.getItemDetailId(),
                                        d.getRentHour(),
                                        d.getPrice(),
                                        d.getSize(),
                                        d.getTotalQuantity(),
                                        d.getStockQuantity(),
                                        d.getIsActive()
                                ))
                                .toList();
                    // 3. 최종적으로 ItemResponseDTO로 감싸서 List<ItemResponseDTO>로 반환
                    return new ItemResponseDTO(
                            item.getItemId(),
                            item.getName(),
                            item.getCategory().name(),
                            item.getImage(),
                            sortedDetailList
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

    // 장비 조회 (장비 + 디테일 수정용)
    public ItemConfirmDTO getItemByRent(Long rentId, Long itemId) {
        Item item = itemRepository.findByRent_RentIdAndItemId(rentId, itemId)
                .orElseThrow(() -> new RuntimeException("해당 장비를 찾을 수 없습니다."));

        // LinkedHashMap: 입력 순서를 보장
        Map<String, ItemConfirmDTO.DetailGroups> groupedDetails = new LinkedHashMap<>();
        Map<String, ItemConfirmDTO.SizeStocks> sizeStockMap = new LinkedHashMap<>();

        // 비활성화된 상세 정보는 무시 (YesNo.Y만 통과)
        for (ItemDetail detail : item.getItemDetails()) {
            if (detail.getIsActive() != YesNo.Y) continue;

            // rentHour + price 조합으로 그룹화
            String groupKey = detail.getRentHour() + "-" + detail.getPrice();
            if (!groupedDetails.containsKey(groupKey)) {
                ItemConfirmDTO.DetailGroups group = new ItemConfirmDTO.DetailGroups();
                group.setItemDetailId(detail.getItemDetailId());
                group.setRentHour(detail.getRentHour());
                group.setPrice(detail.getPrice());
                groupedDetails.put(groupKey, group);
            }

            // size 기준으로 중복 없는 사이즈 수량 정보 수집
            String sizeKey = detail.getSize();
            if (!sizeStockMap.containsKey(sizeKey)) {
                ItemConfirmDTO.SizeStocks stock = new ItemConfirmDTO.SizeStocks();
                stock.setSize(detail.getSize());
                stock.setTotalQuantity(detail.getTotalQuantity());
                stock.setStockQuantity(detail.getStockQuantity());
                sizeStockMap.put(sizeKey, stock);
            }
        }

        // DTO 생성
        ItemConfirmDTO dto = new ItemConfirmDTO();
        dto.setItemId(item.getItemId());
        dto.setRentId(item.getRent().getRentId());
        dto.setCategory(item.getCategory().name());
        dto.setName(item.getName());
        //Map에 저장된 값을 List형식으로 설정
        dto.setDetailList(new ArrayList<>(groupedDetails.values()));
        dto.setSizeStockList(new ArrayList<>(sizeStockMap.values()));

        System.out.println("서비스 수정하기위한 조회 ===> " +dto);
        return dto;
    }

    //장비수정 (장비 + 디테일)
    public void updateItemByDetail(ItemConfirmDTO dto) {
        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        List<ItemDetail> existingDetails = item.getItemDetails();

        List<ItemConfirmDTO.DetailGroups> detailList = dto.getDetailList();
        List<ItemConfirmDTO.SizeStocks> sizeList = dto.getSizeStockList();

        // 1. DTO에 있는 조합(시간 + 사이즈) 세트 생성 (이걸로 활성화 여부 체크)
        Set<String> activeKeys = new HashSet<>();
        if (detailList != null && sizeList != null) {
            for (ItemConfirmDTO.DetailGroups detail : detailList) {
                for (ItemConfirmDTO.SizeStocks sizeStock : sizeList) {
                    String key = detail.getRentHour() + "_" + sizeStock.getSize();
                    activeKeys.add(key);
                }
            }
        }

        // 2. 기존 아이템 디테일 중 DTO에 없는 건 비활성화 처리
        for (ItemDetail existing : existingDetails) {
            String existingKey = existing.getRentHour() + "_" + existing.getSize();
            if (!activeKeys.contains(existingKey)) {
                existing.setIsActive(YesNo.N); // 비활성화
            } else {
                existing.setIsActive(YesNo.Y); // 혹시 비활성화 되어있으면 다시 활성화
            }
        }

        // 3. DTO에 있는 조합들 처리 (업데이트 또는 신규 추가)
        if (detailList != null && sizeList != null) {
            for (ItemConfirmDTO.DetailGroups detail : detailList) {
                for (ItemConfirmDTO.SizeStocks sizeStock : sizeList) {
                    String key = detail.getRentHour() + "_" + sizeStock.getSize();

                    // 기존 데이터 찾기
                    ItemDetail existing = existingDetails.stream()
                            .filter(d -> Objects.equals(d.getRentHour(), detail.getRentHour()) &&
                                    Objects.equals(d.getSize(), sizeStock.getSize()))
                            .findFirst()
                            .orElse(null);

                    if (existing != null) {
                        // 업데이트
                        existing.setPrice(detail.getPrice());
                        existing.setTotalQuantity(sizeStock.getTotalQuantity());
                        existing.setStockQuantity(sizeStock.getStockQuantity());
                        existing.setIsActive(YesNo.Y);
                    } else {
                        // 신규 추가
                        ItemDetail newDetail = ItemDetail.builder()
                                .item(item)
                                .rentHour(detail.getRentHour())
                                .price(detail.getPrice())
                                .size(sizeStock.getSize())
                                .totalQuantity(sizeStock.getTotalQuantity())
                                .stockQuantity(sizeStock.getStockQuantity())
                                .isActive(YesNo.Y)
                                .build();
                        item.getItemDetails().add(newDetail);
                    }
                }
            }
        }

        itemRepository.save(item);
    }



    //장비 옵션 추가
    public void addItemOption(Long itemId, OptionRequestDTO dto){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다: " + itemId));

        for (SizeStockDTO sizeDto : dto.getSizeStocks()) {
            ItemDetail detail = new ItemDetail();

            detail.setItem(item);
            detail.setRentHour(dto.getRentHour());
            detail.setPrice(dto.getPrice());

            detail.setSize(sizeDto.getSize());
            detail.setTotalQuantity(sizeDto.getTotalQuantity());
            detail.setStockQuantity(sizeDto.getStockQuantity());

            detail.setIsActive(YesNo.Y);  // 기본 활성 상태 설정

            itemDetailRepository.save(detail);
        }
    }

    // 렌탈샵 아이템 페이징
    public Page<ItemResponseDTO> getRentItemPaging(Long rentId, String category, Pageable pageable) {
        System.out.println("요청 카테고리: " + category);
        Page<Item> items = itemRepository.rentItemPaging(rentId, ItemCategory.valueOf(category), pageable);

        return items.map(item -> {
            List<ItemDetailDTO> details = item.getItemDetails().stream()
                    .filter(d -> d.getIsActive() == YesNo.Y)
                    .map(d -> new ItemDetailDTO(
                            d.getItemDetailId(),
                            d.getRentHour(),
                            d.getPrice(),
                            d.getSize(),
                            d.getTotalQuantity(),
                            d.getStockQuantity(),
                            d.getIsActive()
                    ))
                    .toList();

            return new ItemResponseDTO(
                    item.getItemId(),
                    item.getName(),
                    item.getCategory().name(),
                    item.getImage(),
                    details
            );
        });
    }

    // 렌탈샵 아이템 상세 페이지
    public ItemDetailPageDTO getItemDetailPage(Long rentId, Long itemId) {
        Item item = itemRepository.findByRent_RentIdAndItemId(rentId, itemId)
                .orElseThrow(() -> new RuntimeException("해당 장비를 찾을 수 없습니다."));

        List<ItemDetailFlatDTO> detailList = item.getItemDetails().stream()
                .filter(d -> d.getIsActive() == YesNo.Y)
                .map(d -> new ItemDetailFlatDTO(
                        d.getItemDetailId(),
                        d.getRentHour(),
                        d.getPrice(),
                        d.getSize(),
                        d.getStockQuantity()
                ))
                .toList();

        return new ItemDetailPageDTO(
                item.getItemId(),
                item.getName(),
                item.getImage(),
                item.getCategory().name(),
                detailList
        );
    }
}
