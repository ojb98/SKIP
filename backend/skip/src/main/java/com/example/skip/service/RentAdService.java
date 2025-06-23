package com.example.skip.service;

import com.example.skip.dto.ad.AdCashChargeDTO;
import com.example.skip.dto.banner.BannerWaitingListDTO;
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
import java.util.Map;

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

    public Map<String, Double> getRatings(Long userId, Long rentId) {
        Rent rent = findRent(userId, rentId);
        BigDecimal avg = reviewRepository.findAverageRatingByRentId(rent.getRentId());
        BigDecimal recent = reviewRepository.findRecent7dRatingByRentId(rent.getRentId(), LocalDateTime.now().minusDays(7));

        double a = avg != null ? avg.doubleValue() : 2.5;
        double r = recent != null ? recent.doubleValue() : 2.5;

        return Map.of(
                "averageRating", a,
                "recentRating", r
        );
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
        Rent rent = findRent(dto.getUserId(), dto.getRentId());
        verifyCashToken(rent, dto.getCashToken());
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

    public String purchaseBoost(Long userId, Long rentId, int boost, int cpb, String cashToken) {
        Rent rent = findRent(userId, rentId);
        verifyCashToken(rent, cashToken);
        int total = cpb * boost;
        if (rent.getRemainAdCash() < total) {
            throw new IllegalArgumentException("잔여 캐시가 부족합니다.");
        }
        rent.setRemainAdCash(rent.getRemainAdCash() - total);
        LocalDate nextMonday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        LocalDateTime endDate = nextMonday.atTime(3,0);
        Boost newBoost = Boost.builder()
                .rentId(rent.getRentId())
                .boost(boost)
                .cpb(cpb)
                .endDate(endDate)
                .build();
        boostRepository.save(newBoost);
        rentRepository.save(rent);
        return aesUtil.encrypt(String.valueOf(rent.getRemainAdCash()));
    }

    public int getActiveBoost(Long userId, Long rentId) {
        Rent rent = findRent(userId, rentId);
        return boostRepository.findAllByRentIdAndEndDateAfter(rent.getRentId(), LocalDateTime.now())
                .stream()
                .mapToInt(Boost::getBoost)
                .sum();
    }

    public String submitBanner(Long userId, Long rentId, int cpcBid, MultipartFile bannerImage, String cashToken) {
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
        return aesUtil.encrypt(String.valueOf(rent.getRemainAdCash()));
    }

    private void verifyCashToken(Rent rent, String token) {
        String expected = aesUtil.encrypt(String.valueOf(rent.getRemainAdCash()));
        if (!expected.equals(token)) {
            throw new IllegalArgumentException("잔여 캐시 검증 실패");
        }
    }

    public int decryptCash(String cashToken) {
        String plain = aesUtil.decrypt(cashToken);
        return Integer.parseInt(plain);
    }


    public BannerWaitingListDTO getBanner(Long userId, Long waitingId) {
        BannerWaitingList banner = bannerService.getBannerWaitingById(waitingId)
                .orElseThrow(() -> new IllegalArgumentException("배너 요청을 찾을 수 없습니다."));
        if (!banner.getRent().getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        return new BannerWaitingListDTO(banner);
    }

    public BannerWaitingListDTO resubmitBanner(Long userId, Long waitingId, int cpcBid, MultipartFile bannerImage) {
        BannerWaitingList banner = bannerService.getBannerWaitingById(waitingId)
                .orElseThrow(() -> new IllegalArgumentException("배너 요청을 찾을 수 없습니다."));
        if (!banner.getRent().getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        if (banner.getStatus() != BannerWaitingListStatus.WITHDRAWN) {
            throw new IllegalStateException("반려된 배너만 수정할 수 있습니다.");
        }

        banner.setCpcBid(cpcBid);
        String url = fileUploadUtil.uploadFileAndUpdateUrl(bannerImage, banner.getBannerImage(), "banners");
        banner.setBannerImage(url);

        LocalDate nextMonday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        banner.setRegistDay(nextMonday.atTime(3, 0));
        banner.setStatus(BannerWaitingListStatus.PENDING);
        banner.setComments(null);

        bannerService.populateRatings(banner);
        bannerWaitingListRepository.save(banner);
        return new BannerWaitingListDTO(banner);
    }

    public BannerWaitingListDTO getLatestWithdrawnBanner(Long userId) {
        BannerWaitingList banner = bannerWaitingListRepository
                .findTopByRent_User_UserIdAndStatusOrderByUpdatedAtDesc(userId, BannerWaitingListStatus.WITHDRAWN);
        if (banner == null) {
            return null;
        }
        return new BannerWaitingListDTO(banner);
    }
}