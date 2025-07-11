package com.example.skip.repository;

import com.example.skip.dto.UserDto;
import com.example.skip.entity.User;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.enumeration.UserStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;
import java.util.Set;

@SpringBootTest
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Test
    public void admin() {
        UserDto userDto = new UserDto(null, "admin", "1234", "admin", "admin", "010-000-0000", UserSocial.NONE, Set.of("USER", "MANAGER", "ADMIN"), UserStatus.APPROVED, null, null, null);
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.saveAndFlush(userDto.toEntity());
    }

    @Test
    public void manager() {
        UserDto userDto = new UserDto(null, "manager", "1234", "manager", "manager", "010-555-0000", UserSocial.NONE, Set.of("USER", "MANAGER"), UserStatus.APPROVED, null, null, null);
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.saveAndFlush(userDto.toEntity());
    }

    @Test
    public void rentadmin() {
        UserDto userDto = new UserDto(null, "rent", "1234", "rent", "rent", "rent", UserSocial.NONE, Set.of("USER", "MANAGER"), UserStatus.APPROVED, null, null, null);
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.saveAndFlush(userDto.toEntity());
    }

//
//    @Test
//    public void user() {
//        UserDto userDto = new UserDto(null, "user", "1234", "user", "user", "user", UserSocial.NONE, Set.of("USER", "MANAGER", "ADMIN"), UserStatus.APPROVED, null, null, null);
//        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
//        userRepository.saveAndFlush(userDto.toEntity());
//    }
//
//    @Test
//    public void userAdd() {
//        for(int i = 0; i <= 10; i++) {
//            UserDto userDto = new UserDto(null, "user" + i, "1234", "user" + i, "user" + i, "user" + i, UserSocial.NONE, Set.of("USER", "MANAGER", "ADMIN"), UserStatus.APPROVED, null, null, null);
//            userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
//            userRepository.save(userDto.toEntity());
//        }
//        userRepository.flush();
//    }



    @Test
    public void select() {
        System.out.println(userRepository.getUserWithRolesByUsername("admin"));
    }
}