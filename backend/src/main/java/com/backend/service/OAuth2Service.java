package com.backend.service;

import com.backend.dto.AuthResponseDTO;
import com.backend.dto.UserSummaryDTO;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import com.backend.security.jwt.JwtTokenProvider;
import com.backend.security.userdetails.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

/**
 * OAuth2 인증 처리 서비스
 * Google 로그인 사용자 정보 처리 및 JWT 토큰 생성
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2Service {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Google OAuth2 사용자 정보로 로그인 처리
     * 기존 사용자만 로그인 처리, 신규 사용자는 null 반환
     *
     * @param attributes Google에서 받은 사용자 정보
     * @return 인증 응답 (JWT 토큰 포함) 또는 null (신규 사용자)
     */
    @Transactional
    public AuthResponseDTO processOAuthLogin(Map<String, Object> attributes) {
        // Google에서 받은 사용자 정보 추출
        String providerId = (String) attributes.get("sub");  // Google 고유 ID
        String email = (String) attributes.get("email");

        log.info("Google OAuth 로그인 시도: email={}, providerId={}", email, providerId);

        // provider와 providerId로 기존 사용자 조회
        Optional<User> userOptional = userRepository.findByProviderAndProviderId("google", providerId);

        if (userOptional.isEmpty()) {
            log.info("신규 Google 사용자: email={}, providerId={}", email, providerId);
            // 신규 사용자는 null 반환 (회원가입 페이지로 리다이렉트하도록)
            return null;
        }

        User user = userOptional.get();

        // 활성화 상태 확인
        if (!user.getIsActive() || user.getIsDeleted()) {
            log.warn("비활성화된 계정: userId={}", user.getUserId());
            throw new RuntimeException("비활성화된 계정입니다.");
        }

        // 마지막 로그인 시간 업데이트
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // JWT 토큰 생성
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userPrincipal);

        log.info("Google OAuth 로그인 성공: userId={}, email={}", user.getUserId(), user.getEmail());

        // 응답 DTO 생성
        UserSummaryDTO userSummary = UserSummaryDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .profileImage(user.getProfileImage())
                .build();

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600) // 1시간 (초 단위)
                .user(userSummary)
                .build();
    }
}
