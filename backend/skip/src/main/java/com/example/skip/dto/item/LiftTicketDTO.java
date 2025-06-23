package com.example.skip.dto.item;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
public class LiftTicketDTO {
    private Long itemId;
    private Long rentId;
    private String category;
    private String name;
    private MultipartFile image;
    private List<LiftTicketOption> options;

    @Data
    @Builder
    public static class LiftTicketOption {
        private Integer rentHour;
        private Integer price;
        private Integer totalQuantity;
        private Integer stockQuantity;
    }
}
