package com.example.skip.repository;

import com.example.skip.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findTop5ByReservation_User_UserIdOrderByCreatedAtDesc(Long userId);

}
