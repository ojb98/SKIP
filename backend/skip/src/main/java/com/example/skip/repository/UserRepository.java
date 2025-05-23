package com.example.skip.repository;

import com.example.skip.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select u " +
            "from User u " +
            "where u.username = :username")
    @EntityGraph(attributePaths = {"roles"})
    User getUserWithRolesByUsername(@Param("username") String username);

    Optional<User> findByUsername(String username);

    List<User> findByUsernameContaining(String keyword);
    List<User> findByNameContaining(String keyword);
}
