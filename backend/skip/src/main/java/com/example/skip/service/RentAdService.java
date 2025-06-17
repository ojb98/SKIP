package com.example.skip.service;

import com.example.skip.entity.BannerWaitingList;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.BannerWaitingListStatus;
import com.example.skip.enumeration.YesNo;
import com.example.skip.repository.BannerWaitingListRepository;
import com.example.skip.repository.RentRepository;
import com.example.skip.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
@Transactional
public class RentAdService {

    private final RentRepository rentRepository;
    private final BannerWaitingListRepository bannerWaitingListRepository;
    private final BannerService bannerService;
    private final FileUtil fileUtil;

    private Rent findRent(Long userId) {
        return rentRepository.findByUser_UserIdAndUseYn(userId, YesNo.Y, Sort.unsorted())
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("렌탈샵을 찾을 수 없습니다."));
    }

    public int getMileage(Long userId) {
        return findRent(userId).getRemainAdCash();
    }

    public int addMileage(Long userId, int amount) {
        Rent rent = findRent(userId);
        rent.setRemainAdCash(rent.getRemainAdCash() + amount);
        rentRepository.save(rent);
        return rent.getRemainAdCash();
    }

    public int submitBanner(Long userId, int cpcBid, MultipartFile bannerImage) {
        Rent rent = findRent(userId);
        if (rent.getRemainAdCash() < cpcBid) {
            throw new IllegalArgumentException("잔여 캐시가 부족합니다.");
        }
        rent.setRemainAdCash(rent.getRemainAdCash() - cpcBid);
        String url = fileUtil.uploadFile(bannerImage, "banners");

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