package com.example.skip.dto.request;

import com.example.skip.annotation.EmailValid;
import lombok.Data;

@Data
public class EmailCompareRequest implements EmailValid {
    private String username;

    private String email;
}
