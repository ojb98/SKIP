package com.example.skip.repository;

import com.example.skip.dto.projection.RentSummaryDTO;
import com.example.skip.dto.rent.RentDTO;
import com.example.skip.entity.Rent;
import com.example.skip.enumeration.RentCategory;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserStatus;
import com.example.skip.enumeration.YesNo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface RentRepository extends JpaRepository<Rent, Long> {

    //전체 렌탈샵 조회(userId 기준 + 사용여부(useYn = Y) + 등록일 내림차순)
    List<Rent> findByUser_UserIdAndUseYn(Long userId,YesNo useYn,Sort sort);

    //createdAt 기준 내림차순으로 정렬
    List<Rent> findAll(Sort sort);

    //최고관리자 승인상태(조회)
    List<Rent> findByStatus(UserStatus status, Sort sort);

    //사업자등록번호 존재 여부
    boolean existsByBizRegNumber(String bizRegNumber);

    List<Rent> findByCategory(RentCategory category);

    List<Rent> findByUser_UsernameContaining(String userUsername);

    List<Rent> findByNameContaining(String name);

    List<Rent> findByUser_NameContaining(String userName);


    // user기준 렌탈샵 조회
    List<Rent> findByUserAndUseYnAndStatus(User user,YesNo yesNo,UserStatus status);

    List<Rent> findByUpdatedAtAfter(LocalDateTime updatedAtAfter);
}
