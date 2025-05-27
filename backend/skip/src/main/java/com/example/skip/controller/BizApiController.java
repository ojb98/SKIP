package com.example.skip.controller;

import com.example.skip.dto.rent.BizApiDTO;
import com.example.skip.dto.rent.BizVerifyRequest;
import com.example.skip.service.BizApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BizApiController {

    private final BizApiService bizApiService;

    @PostMapping("/verify")
    public ResponseEntity<BizApiDTO> verifyBusiness(@RequestBody BizVerifyRequest request){
        String bno = request.getBizRegNumber();
        System.out.println("bno===>" + bno);
        BizApiDTO bizApiDTO = bizApiService.callBizApi(bno);
        return new ResponseEntity<>(bizApiDTO, HttpStatus.OK);
    }

}
