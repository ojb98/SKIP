package com.example.skip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImpAuthRequest {
    private String imp_key;
    private String imp_secret;
}
