package com.backend.service;

import com.backend.dto.AuthResponseDTO;
import com.backend.dto.UpdateProfileRequestDTO;
import com.backend.dto.UserAddressDTO;
import com.backend.dto.UserSummaryDTO;

/**
 * 사용자 서비스 인터페이스
 */
public interface UserService {

    /**
     * 사용자 프로필 업데이트
     *
     * @param userId 사용자 ID
     * @param request 업데이트 요청 데이터
     * @return 업데이트된 사용자 정보 및 새로운 토큰
     */
    AuthResponseDTO updateProfile(Integer userId, UpdateProfileRequestDTO request);

    /**
     * 사용자 정보 조회
     *
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    UserSummaryDTO getUserProfile(Integer userId);

    /**
     * 사용자 주소 정보 조회
     *
     * @param userId 사용자 ID
     * @return 사용자 주소 정보
     */
    UserAddressDTO getUserAddress(Integer userId);

    /**
     * 닉네임 사용 가능 여부 확인
     *
     * @param nickname 확인할 닉네임
     * @return 사용 가능하면 true, 중복이면 false
     */
    boolean isNicknameAvailable(String nickname);
}
