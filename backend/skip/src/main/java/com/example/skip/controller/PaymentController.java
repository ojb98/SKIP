package com.example.skip.controller;

import com.example.skip.dto.PaymentCompleteDTO;
import com.example.skip.dto.ReservationDTO;
import com.example.skip.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/complete")
    public ResponseEntity<?> completePayment(@RequestBody PaymentCompleteDTO dto) {
        try {
            boolean result = paymentService.completePaymentWithReservation(dto);
            return ResponseEntity.ok().body(Map.of("success", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}