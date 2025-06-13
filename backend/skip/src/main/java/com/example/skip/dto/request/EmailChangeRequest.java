package com.example.skip.dto.request;

import lombok.Data;

@Data
public class EmailChangeRequest {
    private String email;

    private Boolean isVerified;
}
