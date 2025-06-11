package com.example.skip.dto.request;

import com.example.skip.annotation.PhoneValid;
import lombok.Data;

@Data
public class PhoneChangeRequest implements PhoneValid {
    private String phone;
}
