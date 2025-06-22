package com.example.skip.controller;

import com.example.skip.dto.rent.RentDTO;
import com.example.skip.dto.rent.RentInfoDTO;
import com.example.skip.dto.rent.RentRequestDTO;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.dto.response.ItemCategoryRecord;
import com.example.skip.dto.response.RegionRecord;
import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.Region;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.service.RentSearchService;
import com.example.skip.service.RentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/rents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RentController {

    private final RentService rentService;

    private final RentSearchService rentSearchService;


    //렌탈샵 등록
    @PostMapping
    public ResponseEntity<Long> createRent(@ModelAttribute RentRequestDTO rentRequestDTO){
        Long rentId = rentService.createRent(rentRequestDTO);
        return new ResponseEntity<>(rentId, HttpStatus.OK);
    }

    //전체 렌탈샵 조회(사용자기준 + 삭제되지않은것만(useYn =Y))
    @GetMapping("user/{userId}")
    public ResponseEntity<List<RentDTO>> getRentsByUserId(@PathVariable("userId")Long userId){
        List<RentDTO> rents = rentService.getRentsByUserId(userId);
        return new ResponseEntity<>(rents, HttpStatus.OK);
    }

    //전체 렌탈샵 조회(createAt - 내림차순)
    @GetMapping("/all")
    public ResponseEntity<List<RentDTO>> getAllRentsByDesc(){
        List<RentDTO> rents = rentService.getAllRentsByDesc();
        return new ResponseEntity<>(rents, HttpStatus.OK);
    }

    //렌탈샵 단건 조회
    @GetMapping("/{rentId}")
    public ResponseEntity<RentDTO> getRent(@PathVariable("rentId")Long rentId){
        RentDTO rent = rentService.getRent(rentId);
        return new ResponseEntity<>(rent, HttpStatus.OK);
    }

    //렌탈샵 슬라이드 조회
    @GetMapping("/slide/{rentId}")
    public ResponseEntity<RentDTO> getRentSlide(@PathVariable("rentId")Long rentId){
        RentDTO rent = rentService.getRent(rentId);
        return new ResponseEntity<>(rent, HttpStatus.OK);
    }

    //렌탈샵 삭제 처리(useYn = N)
    @PatchMapping("/{rentId}")
    public ResponseEntity<String> deleteRent(@PathVariable("rentId")Long rentId){
        rentService.deleteRent(rentId);
        return new ResponseEntity<>("DeleteRentSuccess", HttpStatus.OK);
    }

    //렌탈샵 정보 수정
    @PostMapping("/update")
    public ResponseEntity<String> updateRent(@ModelAttribute RentRequestDTO dto){
        System.out.println("렌탈샵 수정 DTO ===>"+ dto);

        rentService.updateRent(dto);
        return new ResponseEntity<>("UpdateRentSuccess", HttpStatus.OK);
    }

    //최고관리자 : 상태별 조회(PENDING, APPROVED, WITHDRAWN) - createdAt 기준 내림차순
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RentDTO>> getRentsByStatus(@PathVariable("status")UserStatus status){
        List<RentDTO> rents = rentService.getRentsByStatusDesc(status);
        return new ResponseEntity<>(rents, HttpStatus.OK);
    }

    // 렌탈샵 Id, name만 조회(필터용)
    @GetMapping("/owned/{userId}")
    public ResponseEntity<List<RentInfoDTO>> getRentsByOwner(@PathVariable Long userId) {
        List<RentInfoDTO> rents = rentService.findRentsByUserId(userId);
        return new ResponseEntity<>(rents, HttpStatus.OK);
    }

    //렌탈샵 name만 조회
    @GetMapping("/name/{rentId}")
    public ResponseEntity<String> getRentName(@PathVariable Long rentId) {
        String name = rentService.getNameById(rentId);
        return ResponseEntity.ok(name);
    }

    @GetMapping("/regions")
    public ApiResponse getRegions() {
        return ApiResponse.builder()
                .success(true)
                .data(Arrays.stream(Region.values()).map(RegionRecord::fromRegion).toList())
                .build();
    }

    @GetMapping("/autocomplete")
    public ApiResponse getAutoComplete(@RequestParam("keyword") String keyword) {
        return ApiResponse.builder()
                .success(true)
                .data(rentSearchService.autocomplete(keyword))
                .build();
    }

    @GetMapping("/categories")
    public ApiResponse getItemCategories() {
        return ApiResponse.builder()
                .success(true)
                .data(Arrays.stream(ItemCategory.values()).map(ItemCategoryRecord::fromItemCategory).toList())
                .build();
    }
}
