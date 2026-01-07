package com.backend.service.impl;

import com.backend.dto.AuthResponseDTO;
import com.backend.dto.UpdateProfileRequestDTO;
import com.backend.dto.UserAddressDTO;
import com.backend.dto.UserSummaryDTO;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import com.backend.security.jwt.JwtTokenProvider;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 서비스 구현
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 사용자 프로필 업데이트
     *
     * @param userId 사용자 ID
     * @param request 업데이트 요청 데이터
     * @return 업데이트된 사용자 정보 및 새로운 토큰
     */
    @Override
    @Transactional
    public AuthResponseDTO updateProfile(Integer userId, UpdateProfileRequestDTO request) {
        log.info("프로필 업데이트 시도: userId={}", userId);

        // 사용자 조회
        User user = userRepository.findByUserIdAndIsActiveTrueAndIsDeletedFalse(userId)
                .orElseThrow(() -> {
                    log.warn("프로필 업데이트 실패: 사용자 없음 - userId={}", userId);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
                });

        // 닉네임 업데이트 (username 컬럼에 저장)
        boolean usernameChanged = false;
        if (request.getNickname() != null && !request.getNickname().isBlank()) {
            usernameChanged = !request.getNickname().equals(user.getUsername());
            user.setUsername(request.getNickname());
        }

        // 전화번호 업데이트
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }

        // 우편번호 업데이트
        if (request.getZipcode() != null && !request.getZipcode().isBlank()) {
            user.setZipcode(request.getZipcode());
        }

        // 기본 주소 업데이트
        if (request.getAddress1() != null && !request.getAddress1().isBlank()) {
            user.setAddress1(request.getAddress1());
        }

        // 상세 주소 업데이트
        if (request.getAddress2() != null && !request.getAddress2().isBlank()) {
            user.setAddress2(request.getAddress2());
        }

        // 비밀번호 업데이트
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        // 프로필 이미지 업데이트
        if (request.getProfileImage() != null && !request.getProfileImage().isBlank()) {
            user.setProfileImage(request.getProfileImage());
        }

        // 저장
        User updatedUser = userRepository.save(user);
        log.info("프로필 업데이트 성공: userId={}, usernameChanged={}", userId, usernameChanged);

        // UserPrincipal 생성
        UserPrincipal userPrincipal = UserPrincipal.create(updatedUser);

        // 새로운 토큰 생성 (username이 변경된 경우 필수)
        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userPrincipal);

        log.info("새로운 토큰 발급 완료: userId={}", userId);

        // AuthResponseDTO 생성 및 반환
        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600) // 1시간 (실제 설정값에 따라 조정 필요)
                .user(toUserSummaryDTO(updatedUser))
                .build();
    }

    /**
     * 사용자 정보 조회
     *
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    @Override
    @Transactional(readOnly = true)
    public UserSummaryDTO getUserProfile(Integer userId) {
        log.info("사용자 프로필 조회: userId={}", userId);

        User user = userRepository.findByUserIdAndIsActiveTrueAndIsDeletedFalse(userId)
                .orElseThrow(() -> {
                    log.warn("사용자 프로필 조회 실패: userId={}", userId);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
                });

        log.info("사용자 프로필 조회 성공: userId={}", userId);
        return toUserSummaryDTO(user);
    }

    /**
     * 사용자 주소 정보 조회
     *
     * @param userId 사용자 ID
     * @return 사용자 주소 정보
     */
    @Override
    @Transactional(readOnly = true)
    public UserAddressDTO getUserAddress(Integer userId) {
        log.info("사용자 주소 조회: userId={}", userId);

        User user = userRepository.findByUserIdAndIsActiveTrueAndIsDeletedFalse(userId)
                .orElseThrow(() -> {
                    log.warn("사용자 주소 조회 실패: userId={}", userId);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
                });

        log.info("사용자 주소 조회 성공: userId={}", userId);
        return UserAddressDTO.fromEntity(user);
    }

    /**
     * 닉네임 사용 가능 여부 확인
     *
     * @param nickname 확인할 닉네임
     * @return 사용 가능하면 true, 중복이면 false
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isNicknameAvailable(String nickname) {
        log.info("닉네임 중복 확인: nickname={}", nickname);

        // username 컬럼에서 중복 확인
        boolean exists = userRepository.existsByUsernameAndIsActiveTrueAndIsDeletedFalse(nickname);

        log.info("닉네임 중복 확인 결과: nickname={}, available={}", nickname, !exists);
        return !exists;
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
