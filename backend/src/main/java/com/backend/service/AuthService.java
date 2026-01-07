package com.backend.service;

import com.backend.dto.AuthResponseDTO;
import com.backend.dto.RefreshTokenRequestDTO;
import com.backend.dto.SignInRequestDTO;
import com.backend.dto.SignUpRequestDTO;
import com.backend.dto.UserSummaryDTO;

/**
 * 인증 서비스 인터페이스
 */
public interface AuthService {

    /**
     * 회원가입
     *
     * @param signUpRequest 회원가입 요청 DTO
     * @return 생성된 사용자 정보
     */
    UserSummaryDTO signUp(SignUpRequestDTO signUpRequest);

    /**
     * 로그인
     *
     * @param signInRequest 로그인 요청 DTO
     * @return 인증 정보 (토큰 포함)
     */
    AuthResponseDTO signIn(SignInRequestDTO signInRequest);

    /**
     * 토큰 갱신
     *
     * @param refreshTokenRequest Refresh Token 요청 DTO
     * @return 새로운 인증 정보 (토큰 포함)
     */
    AuthResponseDTO refreshToken(RefreshTokenRequestDTO refreshTokenRequest);

    /**
     * 현재 사용자 정보 조회
     *
     * @param userId 사용자 ID
     * @return 사용자 요약 정보
     */
    UserSummaryDTO getCurrentUser(Integer userId);
}
