package com.backend.controller;

import com.backend.dto.AuthResponseDTO;
import com.backend.service.OAuth2Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * OAuth2 인증 컨트롤러
 * Google 소셜 로그인 처리
 */
@Slf4j
@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final OAuth2Service oauth2Service;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    /**
     * Google 로그인 페이지로 리다이렉트
     *
     * @return Google OAuth 인증 URL
     */
    @GetMapping("/authorize/google")
    public ResponseEntity<Void> authorizeGoogle() {
        String authUrl = UriComponentsBuilder
            .fromHttpUrl("https://accounts.google.com/o/oauth2/v2/auth")
            .queryParam("client_id", googleClientId)
            .queryParam("redirect_uri", redirectUri)
            .queryParam("response_type", "code")
            .queryParam("scope", "profile email")  // 자동으로 URL 인코딩됨
            .queryParam("prompt", "select_account")  // 매번 계정 선택 화면 표시
            .toUriString();

        log.info("Google OAuth 인증 페이지로 리다이렉트: {}", authUrl);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(java.net.URI.create(authUrl))
                .build();
    }

    /**
     * Google OAuth 콜백 처리
     *
     * @param code Google에서 받은 인증 코드
     * @return 프론트엔드로 리다이렉트 (토큰 또는 회원가입 정보 포함)
     */
    @GetMapping("/callback/google")
    public ResponseEntity<Void> callbackGoogle(@RequestParam String code) {
        try {
            log.info("Google OAuth 콜백 수신: code={}", code.substring(0, 10) + "...");

            // 1. 인증 코드로 액세스 토큰 받기
            String accessToken = getGoogleAccessToken(code);

            // 2. 액세스 토큰으로 사용자 정보 받기
            Map<String, Object> userInfo = getGoogleUserInfo(accessToken);

            // 3. 사용자 정보로 로그인 처리 시도
            AuthResponseDTO authResponse = oauth2Service.processOAuthLogin(userInfo);

            // 4-1. 기존 사용자라면 메인 페이지로 리다이렉트 (토큰 포함)
            if (authResponse != null) {
                String frontendUrl = String.format(
                    "http://localhost:3000/oauth/callback?" +
                    "accessToken=%s&" +
                    "refreshToken=%s&" +
                    "userId=%d",
                    authResponse.getAccessToken(),
                    authResponse.getRefreshToken(),
                    authResponse.getUser().getUserId()
                );

                log.info("기존 사용자 로그인 성공, 메인 페이지로 리다이렉트: userId={}", authResponse.getUser().getUserId());

                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(java.net.URI.create(frontendUrl))
                        .build();
            }

            // 4-2. 신규 사용자라면 회원가입 페이지로 리다이렉트 (사용자 정보 포함)
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String providerId = (String) userInfo.get("sub");
            String picture = (String) userInfo.get("picture");

            String signupUrl = String.format(
                "http://localhost:3000/signup?" +
                "email=%s&" +
                "name=%s&" +
                "provider=google&" +
                "providerId=%s&" +
                "picture=%s",
                URLEncoder.encode(email, StandardCharsets.UTF_8),
                URLEncoder.encode(name != null ? name : "", StandardCharsets.UTF_8),
                URLEncoder.encode(providerId, StandardCharsets.UTF_8),
                URLEncoder.encode(picture != null ? picture : "", StandardCharsets.UTF_8)
            );

            log.info("신규 Google 사용자, 회원가입 페이지로 리다이렉트: email={}", email);

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(java.net.URI.create(signupUrl))
                    .build();

        } catch (Exception e) {
            log.error("Google OAuth 콜백 처리 실패", e);
            // 에러 발생 시 프론트엔드 로그인 페이지로 리다이렉트
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(java.net.URI.create("http://localhost:3000/login?error=oauth_failed"))
                    .build();
        }
    }

    /**
     * Google 액세스 토큰 받기
     */
    private String getGoogleAccessToken(String code) {
        String tokenUrl = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null || !responseBody.containsKey("access_token")) {
            throw new RuntimeException("Google 액세스 토큰 받기 실패");
        }

        return (String) responseBody.get("access_token");
    }

    /**
     * Google 사용자 정보 받기
     */
    private Map<String, Object> getGoogleUserInfo(String accessToken) {
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
            userInfoUrl,
            HttpMethod.GET,
            request,
            Map.class
        );

        return response.getBody();
    }
}
