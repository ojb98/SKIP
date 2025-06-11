package com.example.skip.service;

import com.example.skip.exception.CustomEmailException;
import com.example.skip.util.RandomStringGenerator;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;

@Service
@Transactional
@RequiredArgsConstructor
public class EmailVerifyService {
    private final JavaMailSender javaMailSender;

    private final StringRedisTemplate stringRedisTemplate;


    public void sendVerificationCode(String email) {
        String verificationCode = RandomStringGenerator.generate(6, RandomStringGenerator.NUMERIC);

        try {
            String html = new String(new ClassPathResource("templates/email.html").getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            html = html.replace("{{code}}", verificationCode);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom("skip@noreply.com");
            mimeMessageHelper.setSubject("Skip 인증 메일입니다.");
            mimeMessageHelper.setText(html, true);
            mimeMessageHelper.setTo(email);

            javaMailSender.send(mimeMessage);

            stringRedisTemplate.opsForValue().set("verificationCode:" + email, verificationCode, Duration.ofMinutes(10).plusSeconds(1));
        } catch (Exception e) {
            throw new CustomEmailException("Invalid Email");
        }
    }

    public boolean confirmVerificationCode(String email, String code) {
        try {
            String verificationCode = stringRedisTemplate.opsForValue().get("verificationCode:" + email);
            if (verificationCode.equals(code)) {
                return true;
            } else {
                return false;
            }
        } catch (NullPointerException e) {
            throw new CustomEmailException("Code does not exist");
        }
    }
}
