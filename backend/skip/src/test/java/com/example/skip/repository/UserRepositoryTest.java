package com.example.skip.repository;

import com.example.skip.dto.UserDto;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;

import java.util.Set;

@SpringBootTest
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;




    @Test
    public void select() {
        System.out.println(userRepository.getUserWithRolesByUsername("admin"));
    }
}
