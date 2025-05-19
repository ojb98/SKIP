package com.example.skip.service;

import com.example.skip.entity.ActiveBannerList;
import com.example.skip.entity.BannerWaitingList;
import com.example.skip.repository.ActiveBannerListRepository;
import com.example.skip.repository.BannerWaitingListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BannerService {
    @Autowired
    private BannerWaitingListRepository bannerWaitingListRepository;

    @Autowired
    private ActiveBannerListRepository activeBannerListRepository;

    // 대기 배너 리스트 조회
    public List<BannerWaitingList> getAllBannerWaitingLists() {
        return bannerWaitingListRepository.findAll();
    }

    // 활성 배너 리스트 조회
    public List<ActiveBannerList> getAllActiveBannerLists() {
        return activeBannerListRepository.findAll();
    }

    // 단일 배너 조회
    public Optional<BannerWaitingList> getBannerWaitingById(Long id) {
        return bannerWaitingListRepository.findById(id);
    }

    public Optional<ActiveBannerList> getActiveBannerById(Long id) {
        return activeBannerListRepository.findById(id);
    }

    // 배너 저장
    public BannerWaitingList saveBannerWaitingList(BannerWaitingList banner) {
        return bannerWaitingListRepository.save(banner);
    }

    public ActiveBannerList saveActiveBannerList(ActiveBannerList banner) {
        return activeBannerListRepository.save(banner);
    }

    // 배너 삭제
    public void deleteBannerWaitingList(Long id) {
        bannerWaitingListRepository.deleteById(id);
    }

    public void deleteActiveBannerList(Long id) {
        activeBannerListRepository.deleteById(id);
    }


}
