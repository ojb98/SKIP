package com.example.skip.controller;

import com.example.skip.dto.rent.RentDTO;
import com.example.skip.dto.rent.RentRequestDTO;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.service.RentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/rents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RentController {

    private final RentService rentService;

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

}
