package com.example.skip.controller;

import com.example.skip.dto.ItemDTO;
import com.example.skip.dto.ItemRequestDTO;
import com.example.skip.service.FileService;
import com.example.skip.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    //장비 등록
    @PostMapping
    public ResponseEntity<Long> registerItem(@ModelAttribute ItemRequestDTO itemRequestDTO) {
        Long itemId = itemService.registerItem(itemRequestDTO);
        return new ResponseEntity<>(itemId, HttpStatus.OK);
    }

    //단건 조회
    @GetMapping("/{itemId}")
    public ResponseEntity<ItemDTO> getItem(@PathVariable("itemId") Long itemId) {
        ItemDTO itemDTO = itemService.getItem(itemId);
        return ResponseEntity.ok(itemDTO);
    }

    //전체 조회 (렌탈샵 기준 + 사용 중인 장비만)
    @GetMapping("/rent/{rentId}")
    public ResponseEntity<List<ItemDTO>> getAllItemsByRent(@PathVariable("rentId") Long rentId) {
        List<ItemDTO> items = itemService.getAllItemsByDesc(rentId);
        return ResponseEntity.ok(items);
    }

    //장비 수정
    @PutMapping("/{itemId}")
    public ResponseEntity<String> updateItem(@ModelAttribute ItemRequestDTO itemRequestDTO) {
        itemService.updateItem(itemRequestDTO);
        return new ResponseEntity<>("UpdateItemSuccess",HttpStatus.OK);
    }

    //장비 삭제 (isActive = N 처리)
    @PatchMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable("itemId") Long itemId) {
        itemService.deleteItem(itemId);
        return new ResponseEntity<>("DeleteItemSuccess",HttpStatus.OK);
    }

}
