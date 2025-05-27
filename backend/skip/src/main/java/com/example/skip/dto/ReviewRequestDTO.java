package com.example.skip.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ReviewRequestDTO {
    private Long reserveId;
    private int rating;
    private String content;
    private MultipartFile imageFile;
}
