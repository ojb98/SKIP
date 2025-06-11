package com.example.skip.dto;

import com.example.skip.entity.KakaoLinkage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoLinkageDto implements Serializable {
    private Long linkageId;

    private Long userId;

    private String kakaoId;

    private Boolean usernameSet;

    private Boolean passwordSet;

    private Boolean nameSet;

    private Boolean phoneSet;

    private LocalDateTime linkedAt;


    public KakaoLinkageDto(KakaoLinkage kakaoLinkage) {
        linkageId = kakaoLinkage.getLinkageId();
        userId = kakaoLinkage.getUser().getUserId();
        kakaoId = kakaoLinkage.getKakaoId();
        usernameSet = kakaoLinkage.getUsernameSet();
        passwordSet = kakaoLinkage.getPasswordSet();
        nameSet = kakaoLinkage.getNameSet();
        phoneSet = kakaoLinkage.getPhoneSet();
        linkedAt = kakaoLinkage.getLinkedAt();
    }

    public Map<String, Object> getClaims() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("kakaoId", kakaoId);
        claims.put("usernameSet", usernameSet);
        claims.put("passwordSet", passwordSet);
        claims.put("nameSet", nameSet);
        claims.put("phoneSet", phoneSet);
        claims.put("linkedAt", linkedAt.toString());

        return claims;
    }
}
