package com.example.skip.dto.request;

import com.example.skip.annotation.UsernameValid;
import lombok.Data;

@Data
public class UsernameChangeRequest implements UsernameValid {
    private String username;
}
