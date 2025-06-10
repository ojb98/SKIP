package com.example.skip.dto.request;

import com.example.skip.annotation.EmailValid;
import lombok.Data;

@Data
public class UsernameFindRequest implements EmailValid {
    private String email;
}
