package com.backend.service;

import com.backend.dto.AddFridgeItemRequestDTO;
import com.backend.dto.UpdateFridgeItemRequestDTO;
import com.backend.dto.UserFridgeDTO;

import java.util.List;

/**
 * 사용자 냉장고 서비스 인터페이스
 */
public interface UserFridgeService {

    /**
     * 사용자의 모든 냉장고 재료 조회
     *
     * @param userId 사용자 ID
     * @return 재료 목록
     */
    List<UserFridgeDTO> getAllFridgeItems(Integer userId);

    /**
     * 사용자의 카테고리별 재료 조회
     *
     * @param userId   사용자 ID
     * @param category 카테고리
     * @return 재료 목록
     */
    List<UserFridgeDTO> getFridgeItemsByCategory(Integer userId, String category);

    /**
     * 냉장고 재료 추가
     *
     * @param userId  사용자 ID
     * @param request 추가 요청 데이터
     * @return 추가된 재료 정보
     */
    UserFridgeDTO addFridgeItem(Integer userId, AddFridgeItemRequestDTO request);

    /**
     * 냉장고 재료 수정
     *
     * @param userId   사용자 ID
     * @param fridgeId 냉장고 재료 ID
     * @param request  수정 요청 데이터
     * @return 수정된 재료 정보
     */
    UserFridgeDTO updateFridgeItem(Integer userId, Integer fridgeId, UpdateFridgeItemRequestDTO request);

    /**
     * 냉장고 재료 삭제
     *
     * @param userId   사용자 ID
     * @param fridgeId 냉장고 재료 ID
     */
    void deleteFridgeItem(Integer userId, Integer fridgeId);
}
