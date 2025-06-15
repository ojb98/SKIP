package com.example.skip.controller;

import com.example.skip.dto.UserDto;
import com.example.skip.dto.payment.PaymentCompleteDTO;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/complete")
    public ResponseEntity<?> completePayment(@RequestBody PaymentCompleteDTO dto) {
        try {
            System.out.println("리액트에서 넘어온 payment데이터===>"+ dto);
            boolean result = paymentService.completePaymentWithReservation(dto);
            return ResponseEntity.ok().body(Map.of("success", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}