package com.example.skip.controller;

import com.example.skip.dto.UserDto;
import com.example.skip.dto.payment.PaymentCompleteDTO;
import com.example.skip.dto.payment.PaymentDirectDTO;
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

    @PostMapping("/direct")
    public ResponseEntity<?> completeDirectPayment(@RequestBody PaymentDirectDTO dto) {
        log.info("바로결제 요청 수신: {}", dto);
        try {
            boolean result = paymentService.completeDirectPayment(dto);
            return ResponseEntity.ok(Map.of("success", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


}