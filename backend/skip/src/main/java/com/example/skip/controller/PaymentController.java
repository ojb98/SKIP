package com.example.skip.controller;

import com.example.skip.dto.UserDto;
import com.example.skip.dto.payment.*;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.exception.PaymentException;
import com.example.skip.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/prepare")
    public ResponseEntity<?> preparePayment(@RequestBody PaymentPrepareDTO dto) {
        try {
            PaymentPrepareRespDTO resp = paymentService.preparePayment(dto);
            return ResponseEntity.ok(resp);
        } catch (PaymentException e) {
            log.error("결제 준비 오류: {}", e.getErrorCode(), e);
            return ResponseEntity.status(400).body(Map.of("success", false, "errorCode", e.getErrorCode(), "message", e.getMessage()));
        } catch (Exception e) {
            log.error("preparePayment error", e);
            log.error("예상치 못한 오류", e);
            return ResponseEntity.status(500).body(Map.of("success", false, "errorCode", "UNKNOWN_ERROR", "message", "서버 내부 오류가 발생했습니다."));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmDTO dto) {
        try {
            paymentService.confirmPayment(dto.getImpUid(), dto.getMerchantUid(), dto.getAmount());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().build();
    }



    @PostMapping("/complete")
    public ResponseEntity<?> completePayment(@RequestBody PaymentCompleteDTO dto) {
        log.info("리액트에서 넘어온 payment 데이터: {}", dto);
        try {
            boolean result = paymentService.completeCartItemPayment(dto);
            return ResponseEntity.ok(Map.of("success", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

    }

//    @PostMapping("/direct")
//    public ResponseEntity<?> completeDirectPayment(@RequestBody PaymentDirectDTO dto) {
//        log.info("바로결제 요청 수신: {}", dto);
//        try {
//            boolean result = paymentService.completeDirectPayment(dto);
//            return ResponseEntity.ok(Map.of("success", result));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }


}