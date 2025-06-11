package com.example.skip.dto.request;

import com.example.skip.annotation.NicknameValid;
import lombok.Data;

@Data
public class NicknameChangeRequest implements NicknameValid {
    private String nickname;
}
