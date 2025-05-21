package com.example.skip.controller;

import com.example.skip.dto.BizApiDTO;
import com.example.skip.dto.BizVerifyRequest;
import com.example.skip.service.BizApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.Map;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BizApiController {

    private final BizApiService bizApiService;

//    @PostMapping("/verify")  // POST 요청을 받는 API
//    public ResponseEntity<BizApiDTO> verifyBusiness(@RequestBody Map<String, String> request) {
//        String bno = request.get("bizRegNumber");  // 요청으로 받은 사업자등록번호
//
//        // BizApiService를 호출하여 사업자등록번호에 대한 진위 여부를 확인
//        BizApiDTO bizApiDTO = bizApiService.callBizApi(bno);
//
//        // 진위 여부 결과를 반환
//        return new ResponseEntity<>(bizApiDTO, HttpStatus.OK);  // 정상 응답 (200 OK)
//    }

    @PostMapping("/verify")
    public ResponseEntity<BizApiDTO> verifyBusiness(@RequestBody BizVerifyRequest request) throws URISyntaxException {
        String bno = request.getBizRegNumber();
        System.out.println("bno===>" + bno);
        BizApiDTO bizApiDTO = bizApiService.callBizApi(bno);
        return new ResponseEntity<>(bizApiDTO, HttpStatus.OK);
    }

}
