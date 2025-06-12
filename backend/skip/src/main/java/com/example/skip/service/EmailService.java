package com.example.skip.service;

import com.example.skip.exception.CustomEmailException;
import com.example.skip.util.RandomStringGenerator;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    private final StringRedisTemplate stringRedisTemplate;


    public void sendVerificationCode(String email) {
        String verificationCode = RandomStringGenerator.generate(6, RandomStringGenerator.NUMERIC);

        try {
            String html = new String(new ClassPathResource("templates/email-verification.html").getInputStream().readAllBytes(), StandardCharsets.UTF_8);
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

    public void sendUsernames(String email, List<String> usernames) throws Exception {
        String html = new String(new ClassPathResource("templates/email-username-list.html").getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        StringBuffer content = new StringBuffer();
        usernames.forEach(username -> {
            if (username.startsWith("Naver") || username.startsWith("Kakao")) {
                return;
            }
            content.append("<tr><td align=\"center\" valign=\"middle\" style=\"padding: 20px 0; font-size: 1.1em; font-family: Arial, sans-serif;\">");
            content.append(username);
            content.append("</td></tr>");
        });
        html = html.replace("{{content}}", content.toString());

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        mimeMessageHelper.setFrom("skip@noreply.com");
        mimeMessageHelper.setSubject("가입된 아이디 목록입니다.");
        mimeMessageHelper.setText(html, true);
        mimeMessageHelper.setTo(email);

        javaMailSender.send(mimeMessage);
    }
}
