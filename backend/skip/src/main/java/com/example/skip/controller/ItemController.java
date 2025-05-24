package com.example.skip.controller;

import com.example.skip.dto.ItemRequestDTO;
import com.example.skip.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    private final ItemService itemService;

    //장비 등록
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> registerItem(
            @RequestPart("itemRequest") ItemRequestDTO itemRequestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        itemRequestDTO.setImage(image);
        Long itemId = itemService.registerItem(itemRequestDTO);
        return new ResponseEntity<>(itemId, HttpStatus.OK);
    }

}
