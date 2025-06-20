package com.example.skip.service;

import com.example.skip.dto.ad.AdCashChargeDTO;
import com.example.skip.entity.AdPayment;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.entity.Rent;
import com.example.skip.entity.Boost;
import com.example.skip.enumeration.BannerActiveListStatus;
import com.example.skip.enumeration.BannerWaitingListStatus;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.*;
import com.example.skip.util.FileUploadUtil;
import com.example.skip.util.AesUtil;
import com.example.skip.util.IamportTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.io.IOException;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class RentAdService {

    private final RentRepository rentRepository;
    private final BannerWaitingListRepository bannerWaitingListRepository;
    private final BannerService bannerService;
    private final FileUploadUtil fileUploadUtil;
    private final BannerActiveListRepository bannerActiveListRepository;
    private final AdPaymentRepository adPaymentRepository;
    private final BoostRepository boostRepository;
    private final ReviewRepository reviewRepository;
    private final IamportTokenUtil iamportTokenUtil;
    private final AesUtil aesUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final OkHttpClient client = new OkHttpClient();

    private static final int BANNER_REGISTRATION_FEE = 150_000;
    private static final int BASE_BOOST_PRICE = 1_000;

    private int calculateCpb(Rent rent) {
        BigDecimal avg = reviewRepository.findAverageRatingByRentId(rent.getRentId());
        BigDecimal recent = reviewRepository.findRecent7dRatingByRentId(rent.getRentId(), LocalDateTime.now().minusDays(7));

        double a = avg != null ? avg.doubleValue() : 2.5;
        double r = recent != null ? recent.doubleValue() : 2.5;

        double multiplier = 1 + (5.0 - a) * 0.1 + (5.0 - r) * 0.1;
        return (int) Math.round(BASE_BOOST_PRICE * multiplier);
    }

    public int getCpb(Long userId, Long rentId) {
        Rent rent = findRent(userId, rentId);
        return calculateCpb(rent);
    }

    private Rent findRent(Long userId, Long rentId) {
        if (rentId != null) {
            return rentRepository.findById(rentId)
                    .filter(r -> r.getUser().getUserId().equals(userId))
                    .orElseThrow(() -> new IllegalArgumentException("렌탈샵을 찾을 수 없습니다."));
        }
        return rentRepository.findByUser_UserIdAndUseYn(userId, YesNo.Y, Sort.unsorted())
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("렌탈샵을 찾을 수 없습니다."));
    }

    public String getCash(Long userId, Long rentId) {
        int remain = findRent(userId, rentId).getRemainAdCash();
        return aesUtil.encrypt(String.valueOf(remain));
    }

    public String chargeCash(AdCashChargeDTO dto) throws IOException {
    String token = iamportTokenUtil.getIamportToken();
    Request req = new Request.Builder()
            .url("https://api.iamport.kr/payments/" + dto.getImpUid())
            .get()
            .addHeader("Authorization", token)
            .build();

        long paid;
        String merchantUid;
        try (Response resp = client.newCall(req).execute()) {
            if (!resp.isSuccessful()) throw new IOException("결제 조회 실패");
            JsonNode info = objectMapper.readTree(resp.body().string()).get("response");
            paid = info.get("amount").asLong();
            merchantUid = info.get("merchant_uid").asText();
        }

        if (!dto.getAmount().equals(paid)) {
            throw new IllegalStateException("결제 금액 불일치");
        }

        Rent rent = findRent(dto.getUserId(), dto.getRentId());
        rent.setRemainAdCash(rent.getRemainAdCash() + (int) paid);
        rentRepository.save(rent);

        AdPayment adPayment = AdPayment.builder()
                .rentId(rent.getRentId())
                .merchantUid(merchantUid)
                .impUid(dto.getImpUid())
                .totalPrice((double) paid)
                .method("card")
                .status("PAID")
                .createdAt(LocalDateTime.now())
                .build();
        adPaymentRepository.save(adPayment);

            return aesUtil.encrypt(String.valueOf(rent.getRemainAdCash()));
    }

    public int purchaseBoost(Long userId, Long rentId, int boost) {
        Rent rent = findRent(userId, rentId);
        int cpb = calculateCpb(rent);
        int total = cpb * boost;
        if (rent.getRemainAdCash() < total) {
            throw new IllegalArgumentException("잔여 캐시가 부족합니다.");
        }
        rent.setRemainAdCash(rent.getRemainAdCash() - total);
        LocalDate nextMonday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        LocalDateTime endDate = nextMonday.atStartOfDay();
        Boost newBoost = Boost.builder()
                .rentId(rent.getRentId())
                .boost(boost)
                .cpb(cpb)
                .endDate(endDate)
                .build();
        boostRepository.save(newBoost);
        rentRepository.save(rent);
        return rent.getRemainAdCash();
    }

    public int submitBanner(Long userId, Long rentId, int cpcBid, MultipartFile bannerImage) {
        Rent rent = findRent(userId, rentId);
        boolean waitingExists = bannerWaitingListRepository.existsByRent_RentIdAndStatus(rentId, BannerWaitingListStatus.PENDING)
                || bannerWaitingListRepository.existsByRent_RentIdAndStatus(rentId, BannerWaitingListStatus.APPROVED);
        boolean activeExists = bannerActiveListRepository.existsByRent_RentIdAndStatus(rentId, BannerActiveListStatus.ACTIVE);
        if (waitingExists || activeExists) {
            throw new IllegalStateException("이미 등록 또는 신청된 배너가 있습니다.");
        }
        if (rent.getRemainAdCash() < BANNER_REGISTRATION_FEE) {
            throw new IllegalArgumentException("잔여 캐시가 부족합니다.");
        }
        rent.setRemainAdCash(rent.getRemainAdCash() - BANNER_REGISTRATION_FEE);
        String url = fileUploadUtil.uploadFileAndUpdateUrl(bannerImage, null, "banners");

        LocalDate nextMonday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        LocalDateTime registDay = nextMonday.atTime(3, 0);

        BannerWaitingList waiting = BannerWaitingList.builder()
                .rent(rent)
                .cpcBid(cpcBid)
                .bannerImage(url)
                .registDay(registDay)
                .status(BannerWaitingListStatus.PENDING)
                .build();

        bannerService.populateRatings(waiting);
        bannerWaitingListRepository.save(waiting);
        rentRepository.save(rent);
        return rent.getRemainAdCash();
    }
}