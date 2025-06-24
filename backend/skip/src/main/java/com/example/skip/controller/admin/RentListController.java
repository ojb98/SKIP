package com.example.skip.controller.admin;

import com.example.skip.dto.rent.RentDTO;
import com.example.skip.dto.rent.RentInfoDTO;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.repository.RentRepository;
import com.example.skip.service.RentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rent")
@RequiredArgsConstructor
public class RentListController {
    private final RentRepository rentRepository;
    private final RentService rentService;

    @GetMapping
    public ResponseEntity<List<RentDTO>> findAll() {
        List<RentDTO> list = rentService.findAllDto();
        return ResponseEntity.ok(list);
    }
    @GetMapping("/pending")
    public ResponseEntity<List<RentDTO>> findPendingAll() {
        List<RentDTO> list = rentService.findPendingDto();
        return ResponseEntity.ok(list);
    }
    @GetMapping("/withdraw")
    public ResponseEntity<List<RentDTO>> findWithdrawAll() {
        List<RentDTO> list = rentService.findWithdrawDto();
        return ResponseEntity.ok(list);
    }
    @GetMapping("/approval")
    public ResponseEntity<List<RentDTO>> findApprovedAll() {
        List<RentDTO> list = rentService.findApproveDto();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/find/userid/{userid}")
    public List<RentInfoDTO> findRentByUserId(@PathVariable("userid") Long userId) {
        return rentService.findRentsByUserId(userId);
    }

    @GetMapping("/find/username/{username}")
    public List<RentDTO> findRentByUsername(@PathVariable("username") String username) {
        return rentService.findByUserName(username);
    }

    @GetMapping("/find/rentname/{rentname}")
    public List<RentDTO> findRentByName(@PathVariable("rentname") String rentname) {
        return rentService.findByName(rentname);
    }

    @PutMapping("/update/{rentId}/{status}")
    public ResponseEntity<Void> updateStatus(@PathVariable("rentId") Long rentId,
                                             @PathVariable("status") UserStatus status) {
        try {
            rentService.changeStatus(rentId, status);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
