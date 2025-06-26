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
import com.example.skip.util.S3FileUtil;
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
    private final S3FileUtil s3FileUtil;

    //장비 등록
    public Long registerItem(ItemRequestDTO dto){
        Rent rent = rentRepository.findById(dto.getRentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 렌트샵을 찾을 수 없습니다."));

        //String imageUrl = fileUtil.uploadFile(dto.getImage(),"items");
        // S3 업로드로 교체
        String imageUrl = s3FileUtil.uploadFile(dto.getImage(), "items");

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

                    // 연관관계 주입
                    savedItem.getItemDetails().add(detail);

                    itemDetailRepository.save(detail);
                }
            }
        }

        return savedItem.getItemId();
    }

    //리프트권 등록
    public Long registerLiftTicket(LiftTicketDTO dto) {
        // 1. 렌탈샵 확인
        Rent rent = rentRepository.findById(dto.getRentId())
                .orElseThrow(() -> new RuntimeException("렌탈샵 없음"));

        // String imageUrl = fileUtil.uploadFile(dto.getImage(),"items");
        // S3 업로드로 교체
        String imageUrl = s3FileUtil.uploadFile(dto.getImage(), "items");

        // 2. Item 생성
        Item item = Item.builder()
                .rent(rent)
                .name(dto.getName())
                .image(imageUrl)
                .category(ItemCategory.valueOf(dto.getCategory()))
                .build();

        itemRepository.save(item);

        // 3. ItemDetail 생성
        if (dto.getOptions() != null) {
            for (LiftTicketDTO.LiftTicketOption option : dto.getOptions()) {
                ItemDetail detail = ItemDetail.builder()
                        .item(item)
                        .rentHour(option.getRentHour())
                        .price(option.getPrice())
                        .totalQuantity(option.getTotalQuantity())
                        .stockQuantity(option.getStockQuantity())
                        .size(null)
                        .isActive(YesNo.Y)
                        .build();

                // 연관관계 주입
                item.getItemDetails().add(detail);

                itemDetailRepository.save(detail);
            }
        }

        return item.getItemId();
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

    //일반장비인지 리프트권인지 구분
    public Item findItemEntity(Long rentId, Long itemId) {
        return itemRepository.findByRent_RentIdAndItemId(rentId, itemId)
                .orElseThrow(() -> new RuntimeException("해당 아이템을 찾을 수 없습니다."));
    }

    //리프트권 조회
    public LiftTicketDTO getLiftTicketByRent(Long rentId, Long itemId) {
        Item item = itemRepository.findByRent_RentIdAndItemId(rentId, itemId)
                .orElseThrow(() -> new RuntimeException("해당 리프트권을 찾을 수 없습니다."));

        LiftTicketDTO dto = LiftTicketDTO.builder()
                .itemId(item.getItemId())
                .rentId(item.getRent().getRentId())
                .category(item.getCategory().name())
                .name(item.getName())
                .options(new ArrayList<>())
                .build();

        // rentHour + price 단위로 중복 없이 구성
        Map<String, LiftTicketDTO.LiftTicketOption> optionMap = new LinkedHashMap<>();

        for (ItemDetail detail : item.getItemDetails()) {
            if (detail.getIsActive() != YesNo.Y) continue;

            String key = detail.getRentHour() + "-" + detail.getPrice();
            if (!optionMap.containsKey(key)) {
                optionMap.put(key, LiftTicketDTO.LiftTicketOption.builder()
                        .rentHour(detail.getRentHour())
                        .price(detail.getPrice())
                        .totalQuantity(detail.getTotalQuantity())
                        .stockQuantity(detail.getStockQuantity())
                        .build());
            }
        }

        dto.setOptions(new ArrayList<>(optionMap.values()));
        return dto;
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
                .orElseThrow(() -> new RuntimeException("아이템 없음"));

        item.setName(dto.getName());
//        String updatedImageUrl = fileUploadUtil.uploadFileAndUpdateUrl(dto.getImage(), item.getImage(),"items");
        String updatedImageUrl = s3FileUtil.uploadFileAndUpdateUrl(dto.getImage(), item.getImage(),"items");
        item.setImage(updatedImageUrl);


        List<ItemDetail> existItemDetails = item.getItemDetails();

        List<ItemConfirmDTO.DetailGroups> detailList = dto.getDetailList();
        List<ItemConfirmDTO.SizeStocks> sizeList = dto.getSizeStockList();

        if (detailList == null || sizeList == null) {
            throw new IllegalArgumentException("detailList와 sizeStockList는 반드시 존재해야 합니다.");
        }

        // 활성화 키셋: rentHour + size 조합
        Set<String> activeKeys = new HashSet<>();
        for (ItemConfirmDTO.DetailGroups detail : detailList) {
            for (ItemConfirmDTO.SizeStocks sizeStock : sizeList) {
                String sizeKey = sizeStock.getSize();
                String key = detail.getRentHour() + "_" + sizeKey;
                activeKeys.add(key);
            }
        }

        // 기존 ItemDetail 활성화 / 비활성화 처리
        for (ItemDetail existing : existItemDetails) {
            String existingSize = existing.getSize();
            String key = existing.getRentHour() + "_" + existingSize;
            existing.setIsActive(activeKeys.contains(key) ? YesNo.Y : YesNo.N);
        }

        // DTO 조합 기준으로 업데이트 or 신규 추가
        for (ItemConfirmDTO.DetailGroups detail : detailList) {
            for (ItemConfirmDTO.SizeStocks sizeStock : sizeList) {
                String sizeValue = sizeStock.getSize();

                ItemDetail existing = existItemDetails.stream()
                        .filter(d -> Objects.equals(d.getRentHour(), detail.getRentHour()) &&
                                Objects.equals(d.getSize(), sizeValue))
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
                            .size(sizeValue)
                            .totalQuantity(sizeStock.getTotalQuantity())
                            .stockQuantity(sizeStock.getStockQuantity())
                            .isActive(YesNo.Y)
                            .build();
                    item.getItemDetails().add(newDetail);
                }
            }
        }

        itemRepository.save(item);
    }

    //리프트권 수정
    public void updateLiftTicket(LiftTicketDTO dto) {
        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("아이템 없음"));

        item.setName(dto.getName());
//        String updatedImageUrl = fileUploadUtil.uploadFileAndUpdateUrl(dto.getImage(), item.getImage(), "items");
        String updatedImageUrl = s3FileUtil.uploadFileAndUpdateUrl(dto.getImage(), item.getImage(), "items");
        item.setImage(updatedImageUrl);

        List<ItemDetail> existItemDetails = item.getItemDetails();
        List<LiftTicketDTO.LiftTicketOption> options = dto.getOptions();

        Set<Integer> updatedRentHours = new HashSet<>();

        if (options != null) {
            for (LiftTicketDTO.LiftTicketOption option : options) {
                Integer rentHour = option.getRentHour();
                updatedRentHours.add(rentHour);

                Optional<ItemDetail> match = existItemDetails.stream()
                        .filter(d -> d.getSize() == null && Objects.equals(d.getRentHour(), rentHour))
                        .findFirst();

                if (match.isPresent()) {
                    ItemDetail existing = match.get();
                    existing.setPrice(option.getPrice());
                    existing.setTotalQuantity(option.getTotalQuantity());
                    existing.setStockQuantity(option.getStockQuantity());
                    existing.setIsActive(YesNo.Y);
                } else {
                    ItemDetail newDetail = ItemDetail.builder()
                            .item(item)
                            .rentHour(option.getRentHour())
                            .price(option.getPrice())
                            .size(null)
                            .totalQuantity(option.getTotalQuantity())
                            .stockQuantity(option.getStockQuantity())
                            .isActive(YesNo.Y)
                            .build();
                    item.getItemDetails().add(newDetail);
                    itemDetailRepository.save(newDetail);
                }
            }
        }

        for (ItemDetail existing : existItemDetails) {
            if (existing.getSize() == null && !updatedRentHours.contains(existing.getRentHour())) {
                existing.setIsActive(YesNo.N);
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
            // 연관 리스트에 명시적으로 추가
            item.getItemDetails().add(detail);

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
