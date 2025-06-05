package com.example.skip.controller;

import com.example.skip.config.properties.OAuth2Properties;
import com.example.skip.dto.UserDto;
import com.example.skip.dto.response.ApiResponseDto;
import com.example.skip.enumeration.UserSocial;
import com.example.skip.service.UserSocialService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequestMapping("/user/social")
@RequiredArgsConstructor
public class UserSocialController {
    private final UserSocialService userSocialService;


    @GetMapping("/redirect/{client}")
    public void redirect(@PathVariable("client") String client,
                         HttpServletResponse response) throws IOException {

        String url = userSocialService.getAuthorizationUrl(UserSocial.valueOf(client.toUpperCase()));

        response.sendRedirect(url);
    }

    @GetMapping("/link/{client}")
    public void link(@PathVariable("client") String client,
                     @RequestParam("code") String authorizationCode,
                     @AuthenticationPrincipal UserDetails userDetails,
                     HttpServletResponse response) throws IOException {

        UserDto userDto = (UserDto) userDetails;

        userSocialService.link(UserSocial.valueOf(client.toUpperCase()), authorizationCode, userDto);

        response.sendRedirect("http://localhost:5173/mypage/account");
    }

    @ResponseBody
    @DeleteMapping("/unlink")
    public ApiResponseDto unlink(@AuthenticationPrincipal UserDetails userDetails,
                                 OAuth2AuthenticationToken oAuth2AuthenticationToken) {
        System.out.println(oAuth2AuthenticationToken.getName());
        UserDto userDto = (UserDto) userDetails;
        try {
            String accessToken = userSocialService.getAccessToken(userDto);
            userSocialService.unlink(userDto, accessToken);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponseDto.builder()
                    .success(false)
                    .data(e.getMessage()).build();
        }
        return ApiResponseDto.builder()
                .success(true)
                .data("연결을 해제했습니다.").build();
    }
}
