package com.example.skip.enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Getter
@AllArgsConstructor
public enum Region {
    GYEONGGI("경기도", "경기", List.of()),
    KANGWON("강원도", "강원", List.of()),
    JEONBUK("전라북도", "전북", List.of("전라도")),
    GYEONGNAM("경상남도", "경남", List.of("경상도")),
    ETC("기타", null, null);


    private final String fullName;

    private final String shortName;

    private final List<String> aliases;


    public static Region fromFullAddress(String fullAddress) {
        if (fullAddress != null && !fullAddress.isEmpty()) {
            for (Region region : values()) {
                if (region.fullName != null && fullAddress.startsWith(region.fullName)) {
                    return region;
                }

                if (region.shortName != null && fullAddress.startsWith(region.shortName)) {
                    return region;
                }

                if (region.aliases != null) {
                    for (String alias : region.aliases) {
                        if (fullAddress.startsWith(alias)) {
                            return region;
                        }
                    }
                }
            }
        }

        log.info("Region parsing failed for address: {}", fullAddress);

        return ETC;
    }
}
