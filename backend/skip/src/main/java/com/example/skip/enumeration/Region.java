package com.example.skip.enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Getter
@AllArgsConstructor
public enum Region {
    ETC("기타", null, null),
    SEOUL("서울특별시", "서울", List.of()),
    GYEONGGI("경기도", "경기", List.of()),
    KANGWON("강원도", "강원", List.of()),
    CHUNGBUK("충청북", "충북", List.of("충청도")),
    CHUNGNAM("충청남도", "충남", List.of("충청도")),
    JEONBUK("전라북도", "전북", List.of("전라도")),
    JEONNAM("전라북도", "전남", List.of("전라도")),
    GYEONGBUK("경사북도", "경북", List.of("경상도")),
    GYEONGNAM("경상남도", "경남", List.of("경상도"));


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
