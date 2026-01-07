package com.backend.service;

import com.backend.dto.RecipeViewDTO;
import com.backend.entity.RecipeView; // RecipeView 엔티티 import

import java.util.List;

// 레시피 조회 이력 서비스
public interface RecipeViewService {

    // 레시피 조회 이력 저장
    // 사용자가 레시피를 조회할 때마다 호출
    RecipeView recordView(Integer userId, Integer recipeId); // Long -> Integer

    // 사용자가 최근 조회한 레시피 목록 조회 (중복 제거)
    // 같은 레시피를 여러 번 조회한 경우 가장 최근 조회만 반환
    List<RecipeViewDTO> getRecentViewedRecipes(Integer userId, int limit);

    // 사용자의 모든 조회 이력 조회 (중복 포함)
    List<RecipeViewDTO> getAllViewHistories(Integer userId);

    // 사용자의 조회 이력 삭제
    void deleteUserViewHistory(Integer userId);
}