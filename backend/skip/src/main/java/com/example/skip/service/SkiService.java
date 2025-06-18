package com.example.skip.service;

import com.example.skip.dto.rent.RentDTO;
import com.example.skip.dto.rent.SkiLocationDto;
import com.example.skip.dto.response.VworldSearchResponse;
import com.example.skip.enumeration.RentCategory;
import com.example.skip.repository.RentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SkiService {
    private final RentRepository rentRepository;

    private final RestTemplate restTemplate;

    @Value("${vworld.api.key}")
    private String vworldApiKey;

    @Value("${openweather.api.key}")
    private String openweatherApiKey;


    public List<RentDTO> skiList() {
        return rentRepository.findByCategory(RentCategory.SKI).stream().map(RentDTO::new).toList();
    }

    public List<SkiLocationDto> translateAddressToCoordinates(List<RentDTO> rentDTOs) {
        List<SkiLocationDto> list = new ArrayList<>();

        for (RentDTO rentDTO: rentDTOs) {
            WebClient client = WebClient.builder()
                    .baseUrl("https://api.vworld.kr")
                    .build();

            VworldSearchResponse vworldSearchResponse = client.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/req/search")
                            .queryParam("service", "search")
                            .queryParam("request", "search")
                            .queryParam("type", "address")
                            .queryParam("category", "road")
                            .queryParam("key", vworldApiKey)
                            .queryParam("query", rentDTO.getStreetAddress())
                            .build())
                    .retrieve()
                    .bodyToMono(VworldSearchResponse.class)
                    .block();

            log.info("response: {}", vworldSearchResponse);

            list.add(SkiLocationDto.builder()
                    .rentId(rentDTO.getRentId())
                    .name(rentDTO.getName())
                    .basicAddress(rentDTO.getBasicAddress())
                    .streetAddress(rentDTO.getStreetAddress())
                    .detailedAddress(rentDTO.getDetailedAddress())
                    .latitude(Double.parseDouble(vworldSearchResponse.getResponse().getResult().getItems().get(0).getPoint().getY()))
                    .longitude(Double.parseDouble(vworldSearchResponse.getResponse().getResult().getItems().get(0).getPoint().getX()))
                    .build());
        }

        return list;
    }

    public Map<String, Object> getForecast(Double lat, Double lon) {
        WebClient client = WebClient.builder()
                .baseUrl("https://api.openweathermap.org").build();

        Map<String, Object> response = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/data/2.5/forecast")
                        .queryParam("units", "metric")
                        .queryParam("cnt", 40)
                        .queryParam("appid", openweatherApiKey)
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        return response;
    }
}
