package com.example.skip.service;

import com.example.skip.dto.UserDto;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Rollback(value = false)
@Transactional
@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;


    @Test
    public void admin() {

    }
}
