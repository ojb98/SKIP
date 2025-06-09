package com.example.skip.dto.request;

import com.example.skip.annotation.NameValid;
import lombok.Data;

@Data
public class NameChangeRequest implements NameValid {
    private String name;
}
