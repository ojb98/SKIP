package com.example.skip.controller;

import com.example.skip.dto.ItemDetailPageDTO;
import com.example.skip.dto.item.*;

import com.example.skip.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    private final ItemService itemService;

    //장비 등록
    //클라이언트가 보내는 요청(Request) = multipart/form-data 형식의 (파일 + JSON 같이 전송되는 경우) 요청만 처리
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> registerItem(
            //React에서 FormData에 담은 itemRequest (Blob 형태의 JSON)을 자동으로 ItemRequestDTO로 변환
            @RequestPart("itemRequest") ItemRequestDTO itemRequestDTO,
            @RequestPart("image") MultipartFile image) {

        itemRequestDTO.setImage(image);
        Long itemId = itemService.registerItem(itemRequestDTO);
        return new ResponseEntity<>(itemId, HttpStatus.OK);
    }

    @GetMapping("/list/{rentId}")
    public ResponseEntity<List<ItemResponseDTO>> getItemList(@PathVariable("rentId") Long rentId) {
        List<ItemResponseDTO> items = itemService.getItemByDetailList(rentId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    //장비 항목 삭제
    @PatchMapping("/delete")
    public ResponseEntity<String> deletedItemDetail(@RequestBody List<ItemDelDTO> detailDelList){
        for (ItemDelDTO dto: detailDelList){
            itemService.setItemDetailDelete(dto.getItemId(), dto.getItemDetailId());
        }
        return new ResponseEntity<>("deletedItemDetailSuccess",HttpStatus.OK);

    }

    //장비 수정하기 위한 조회
    @GetMapping("/{rentId}/{itemId}")
    public ResponseEntity<ItemConfirmDTO> getItem(@PathVariable("rentId") Long rentId,
                                                  @PathVariable("itemId") Long itemId){
        ItemConfirmDTO dto = itemService.getItemByRent(rentId,itemId);
        return new ResponseEntity<>(dto,HttpStatus.OK);
    }


    //장비 수정
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateItem(@RequestPart("itemRequest") ItemConfirmDTO dto,
                                             @RequestPart(value = "image", required = false) MultipartFile image){

        dto.setImage(image);
        itemService.updateItemByDetail(dto);
        return new ResponseEntity<>("UpdateItemSuccess",HttpStatus.OK);

    }

    //장비 옵션 추가
    @PostMapping("/optionAdd/{itemId}")
    public ResponseEntity<String> addItemOption(@PathVariable Long itemId,
                                                @RequestBody OptionRequestDTO dto){
        itemService.addItemOption(itemId, dto);
        return new ResponseEntity<>("AddOptionItemSuccess",HttpStatus.OK);

    }

    // 아이템 리스트 페이징
    @GetMapping("/paging/{rentId}")
    public ResponseEntity<Page<ItemResponseDTO>> getPagingItems(@PathVariable("rentId") Long rentId,
                                                                @RequestParam String category,
                                                                @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)Pageable pageable) {
        Page<ItemResponseDTO> result = itemService.getRentItemPaging(rentId, category, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 아이템 상세 페이지
    @GetMapping("/detail/{rentId}/{itemId}")
    public ResponseEntity<ItemDetailPageDTO> getItemDetail(@PathVariable Long rentId,
                                                           @PathVariable Long itemId) {
        ItemDetailPageDTO dto = itemService.getItemDetailPage(rentId, itemId);
        return ResponseEntity.ok(dto);
    }

}