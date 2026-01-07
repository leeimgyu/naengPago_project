package com.backend.service.impl;

import com.backend.dto.AuthResponseDTO;
import com.backend.dto.RefreshTokenRequestDTO;
import com.backend.dto.SignInRequestDTO;
import com.backend.dto.SignUpRequestDTO;
import com.backend.dto.UserSummaryDTO;
import com.backend.entity.User;
import com.backend.exception.DuplicateResourceException;
import com.backend.repository.UserRepository;
import com.backend.security.jwt.JwtTokenProvider;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 인증 서비스 구현
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원가입
     *
     * @param signUpRequest 회원가입 요청 DTO
     * @return 생성된 사용자 정보
     */
    @Override
    @Transactional
    public UserSummaryDTO signUp(SignUpRequestDTO signUpRequest) {
        log.info("회원가입 시도: username={}, email={}", signUpRequest.getUsername(), signUpRequest.getEmail());
        log.info("OAuth 정보: provider={}, providerId={}", signUpRequest.getProvider(), signUpRequest.getProviderId());

        // 이메일 중복 체크
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            log.warn("이메일 중복: {}", signUpRequest.getEmail());
            throw new DuplicateResourceException("이미 사용 중인 이메일입니다: " + signUpRequest.getEmail());
        }

        // 사용자명 중복 체크
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            log.warn("사용자명 중복: {}", signUpRequest.getUsername());
            throw new DuplicateResourceException("이미 사용 중인 사용자명입니다: " + signUpRequest.getUsername());
        }

        // User 엔티티 생성
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .zipcode(signUpRequest.getZipcode())      // ✅ 추가
                .address1(signUpRequest.getAddress1())    // ✅ 추가
                .address2(signUpRequest.getAddress2())    // ✅ 추가
                .provider(signUpRequest.getProvider())    // OAuth 제공자
                .providerId(signUpRequest.getProviderId()) // OAuth 제공자 사용자 ID
                .isActive(true)
                .isDeleted(false)
                .build();

        // 저장
        User savedUser = userRepository.save(user);
        log.info("회원가입 성공: userId={}", savedUser.getUserId());

        // UserSummaryDTO 변환 및 반환
        return toUserSummaryDTO(savedUser);
    }

    /**
     * 로그인
     *
     * @param signInRequest 로그인 요청 DTO
     * @return 인증 정보 (토큰 포함)
     */
    @Override
    @Transactional
    public AuthResponseDTO signIn(SignInRequestDTO signInRequest) {
        log.info("로그인 시도: email={}", signInRequest.getEmail());

        // 사용자 조회
        User user = userRepository.findByEmail(signInRequest.getEmail())
                .orElseThrow(() -> {
                    log.warn("로그인 실패: 사용자 없음 - email={}", signInRequest.getEmail());
                    return new UsernameNotFoundException("이메일 또는 비밀번호가 올바르지 않습니다.");
                });

        // 활성화 상태 확인
        if (!user.getIsActive() || user.getIsDeleted()) {
            log.warn("로그인 실패: 비활성화된 계정 - userId={}", user.getUserId());
            throw new BadCredentialsException("비활성화된 계정입니다.");
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(signInRequest.getPassword(), user.getPasswordHash())) {
            log.warn("로그인 실패: 비밀번호 불일치 - email={}", signInRequest.getEmail());
            throw new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 마지막 로그인 시간 업데이트
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // JWT 토큰 생성
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userPrincipal);

        log.info("로그인 성공: userId={}", user.getUserId());

        // AuthResponseDTO 생성 및 반환
        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600) // 1시간 (초 단위)
                .user(toUserSummaryDTO(user))
                .build();
    }

    /**
     * 토큰 갱신
     *
     * @param refreshTokenRequest Refresh Token 요청 DTO
     * @return 새로운 인증 정보 (토큰 포함)
     */
    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO refreshToken(RefreshTokenRequestDTO refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        log.info("토큰 갱신 시도");

        // Refresh Token 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("토큰 갱신 실패: 유효하지 않은 Refresh Token");
            throw new BadCredentialsException("유효하지 않은 Refresh Token입니다.");
        }

        // 사용자명 추출
        String username = jwtTokenProvider.extractUsername(refreshToken);

        // 사용자 조회
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("토큰 갱신 실패: 사용자 없음 - username={}", username);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
                });

        // 활성화 상태 확인
        if (!user.getIsActive() || user.getIsDeleted()) {
            log.warn("토큰 갱신 실패: 비활성화된 계정 - userId={}", user.getUserId());
            throw new BadCredentialsException("비활성화된 계정입니다.");
        }

        // 새로운 Access Token 생성
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String newAccessToken = jwtTokenProvider.generateAccessToken(userPrincipal);

        log.info("토큰 갱신 성공: userId={}", user.getUserId());

        // AuthResponseDTO 생성 및 반환 (Refresh Token은 재사용)
        return AuthResponseDTO.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // 기존 Refresh Token 재사용
                .tokenType("Bearer")
                .expiresIn(3600) // 1시간 (초 단위)
                .user(toUserSummaryDTO(user))
                .build();
    }

    /**
     * 현재 사용자 정보 조회
     *
     * @param userId 사용자 ID
     * @return 사용자 요약 정보
     */
    @Override
    @Transactional(readOnly = true)
    public UserSummaryDTO getCurrentUser(Integer userId) {
        log.info("현재 사용자 조회: userId={}", userId);

        User user = userRepository.findByUserIdAndIsActiveTrueAndIsDeletedFalse(userId)
                .orElseThrow(() -> {
                    log.warn("사용자 조회 실패: userId={}", userId);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
                });

        log.info("현재 사용자 조회 성공: userId={}", userId);
        return toUserSummaryDTO(user);
    }

    /**
     * User 엔티티를 UserSummaryDTO로 변환
     *
     * @param user User 엔티티
     * @return UserSummaryDTO
     */
    private UserSummaryDTO toUserSummaryDTO(User user) {
        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .nickname(user.getUsername())  // username을 nickname으로 매핑
                .phone(user.getPhone())
                .zipcode(user.getZipcode())
                .address1(user.getAddress1())
                .address2(user.getAddress2())
                .profileImage(user.getProfileImage())
                .build();
    }
}
