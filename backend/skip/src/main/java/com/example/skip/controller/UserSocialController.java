package com.example.skip.controller;

import com.example.skip.dto.UserDto;
import com.example.skip.dto.response.ApiResponse;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.service.UserSocialService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
@RequestMapping("/user/social")
@RequiredArgsConstructor
public class UserSocialController {
    private final UserSocialService userSocialService;

    @Value("${frontend.host}")
    private String frontendHost;

    @Value("${frontend.port}")
    private String frontendPort;


    @GetMapping("/redirect/{client}")
    public void redirect(@PathVariable("client") String client,
                         HttpServletResponse response) throws IOException {

        String url = userSocialService.getAuthorizationUrl(UserSocial.valueOf(client.toUpperCase()));

        response.sendRedirect(url);
    }

    @GetMapping("/link/{client}")
    public String link(@PathVariable("client") String client,
                       @RequestParam("code") String authorizationCode,
                       @AuthenticationPrincipal UserDetails userDetails,
                       RedirectAttributes redirectAttributes) throws IOException {

        UserDto userDto = (UserDto) userDetails;

        Boolean success;
        String data = "";

        try {
            userSocialService.link(UserSocial.valueOf(client.toUpperCase()), authorizationCode, userDto);
            success = true;
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            success = false;
            data = URLEncoder.encode("이미 연동된 소셜 계정입니다.", StandardCharsets.UTF_8);
        }

        return "redirect:http://" + frontendHost + ":" + frontendPort + "/mypage/account?success=" + success + "&data=" + data;
    }

    @ResponseBody
    @DeleteMapping("/unlink")
    public ApiResponse unlink(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = (UserDto) userDetails;

        Boolean unset = false;
        if (userDto.getSocial() == UserSocial.KAKAO) {
            if (!userDto.getKakaoLinkageDto().getUsernameSet() || !userDto.getKakaoLinkageDto().getPasswordSet()) {
                unset = true;
            }
        } else if (userDto.getSocial() == UserSocial.NAVER) {
            if (!userDto.getNaverLinkageDto().getUsernameSet() || !userDto.getNaverLinkageDto().getPasswordSet()) {
                unset = true;
            }
        }
        if (unset) {
            return ApiResponse.builder()
                    .success(false)
                    .data("아이디, 비밀번호를 먼저 설정해주세요.").build();
        }

        try {
            String accessToken = userSocialService.getAccessToken(userDto);
            userSocialService.unlink(userDto, accessToken);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.builder()
                    .success(false)
                    .data(e.getMessage()).build();
        }
        return ApiResponse.builder()
                .success(true)
                .data("연결을 해제했습니다.").build();
    }
}
