package com.example.skip.dto;

import com.example.skip.entity.NaverLinkage;
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
public class NaverLinkageDto implements Serializable {
    private Long linkageId;

    private Long userId;

    private String naverId;

    private Boolean usernameSet;

    private Boolean passwordSet;

    private LocalDateTime linkedAt;


    public NaverLinkageDto(NaverLinkage naverLinkage) {
        linkageId = naverLinkage.getLinkageId();
        userId = naverLinkage.getUser().getUserId();
        naverId = naverLinkage.getNaverId();
        usernameSet = naverLinkage.getUsernameSet();
        passwordSet = naverLinkage.getPasswordSet();
        linkedAt = naverLinkage.getLinkedAt();
    }

    public Map<String, Object> getClaims() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("naverId", naverId);
        claims.put("usernameSet", usernameSet);
        claims.put("passwordSet", passwordSet);
        claims.put("linkedAt", linkedAt.toString());

        return claims;
    }
}
