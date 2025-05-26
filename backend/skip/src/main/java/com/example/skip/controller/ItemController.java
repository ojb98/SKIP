package com.example.skip.controller;

import com.example.skip.dto.ItemDelDTO;
import com.example.skip.dto.ItemRequestDTO;
import com.example.skip.dto.ItemResponseDTO;
import com.example.skip.entity.Item;
import com.example.skip.service.ItemService;
import lombok.RequiredArgsConstructor;
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

    //장비 + 디테일 리스트 조회
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

    @GetMapping("/{rentId}/{itemId}")
    public ResponseEntity<ItemRequestDTO> getItem(@PathVariable("rentId") Long rentId,
                                                  @PathVariable("itemId") Long itemId){
        ItemRequestDTO dto = itemService.getItemByRent(rentId,itemId);
        return new ResponseEntity<>(dto,HttpStatus.OK);
    }

}
